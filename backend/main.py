from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader

from .analyzer import analyze_resume

app = FastAPI(title="DevMind-AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "DevMind-AI Backend is Running!"
    }


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    contents = await file.read()

    with open("temp_resume.pdf", "wb") as f:
        f.write(contents)

    reader = PdfReader("temp_resume.pdf")

    text = ""

    for page in reader.pages:
        extracted = page.extract_text()

        if extracted:
            text += extracted

    return analyze_resume(text)