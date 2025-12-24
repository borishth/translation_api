from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from mtranslate import translate
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse 
import uvicorn
import aiohttp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    source_language: str
    target_language: str

@app.get("/")
async def home():
    return FileResponse("index.html")

# @app.post("/translate")
# async def translate_text(request: TranslationRequest):
#     try:
#         translated_text = translate(
#             request.text,
#             to_language=request.target_language
#         )
#         return {"translated_text": translated_text}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    payload = {
        "src_lang":"eng_Latn",
        "tgt_lang": "asm_Beng",
        "input_text": request.text
    }
    print(payload)

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post("https://clst.iitg.ac.in/apiv3/translate", json=payload) as response:
                if response.status == 200:
                    response_data = await response.json()
        translated_text = response_data.get("output_text")
        return {"translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)