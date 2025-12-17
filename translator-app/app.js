import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Keyboard, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';


const API_URL = "https://translation-api-psi.vercel.app";



export default function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('mni-Mtei');

  const languages = [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "Hindi", value: "hi" },
    { label: "French", value: "fr" },
    { label: "Japanese", value: "ja" },
    { label: "Manipuri", value: "mni-Mtei" },
    { label: "Assamese", value: "as" },
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          source_language: sourceLang,
          target_language: targetLang,
        }),
      });

      const data = await response.json();
      if (data.translated_text) {
        setTranslatedText(data.translated_text);
      } else {
        setTranslatedText("Error: Could not translate.");
      }
    } catch (error) {
      console.error(error);
      setTranslatedText("Network Error. Check your URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const speakResult = () => {
    if (translatedText) {
      Speech.speak(translatedText, { language: targetLang });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Google-AI-Translator</Text>
      </View>

      {/* LANGUAGE SELECTORS */}
      <View style={styles.langContainer}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={sourceLang}
            onValueChange={(itemValue) => setSourceLang(itemValue)}
            style={styles.picker}
          >
            {languages.map((lang) => (
              <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity onPress={swapLanguages} style={styles.swapBtn}>
          <Ionicons name="swap-horizontal" size={24} color="#5f6368" />
        </TouchableOpacity>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={targetLang}
            onValueChange={(itemValue) => setTargetLang(itemValue)}
            style={styles.picker}
          >
            {languages.map((lang) => (
              <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* INPUT AREA */}
      <View style={styles.card}>
        <Text style={styles.label}>Original Text</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter text here..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
      </View>

      {/* ACTION BUTTON */}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.translateBtn} onPress={handleTranslate}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Translate</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* RESULT AREA */}
      <View style={[styles.card, styles.resultCard]}>
        <View style={styles.resultHeader}>
          <Text style={styles.label}>Translation</Text>
          {translatedText ? (
            <TouchableOpacity onPress={speakResult}>
              <Ionicons name="volume-high" size={24} color="#4285F4" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <Text style={styles.resultText}>
          {translatedText || "..."}
        </Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  langContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
    overflow: 'hidden', 
  },
  picker: {
    height: 50,
    width: '100%',
  },
  swapBtn: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
    minHeight: 120,
  },
  resultCard: {
    backgroundColor: '#e8f0fe',
    borderWidth: 1,
    borderColor: '#d2e3fc',
  },
  label: {
    fontSize: 12,
    color: '#5f6368',
    marginBottom: 5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  input: {
    fontSize: 18,
    color: '#333',
    textAlignVertical: 'top',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#202124',
    marginTop: 10,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  translateBtn: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});