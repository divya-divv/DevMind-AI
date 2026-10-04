from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from analyzer import analyze_resume
import os

app = FastAPI(title="DevMind-AI")

# Allow React frontend to connect to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
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

    # Save uploaded resume temporarily
    file_path = "temp_resume.pdf"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    try:
        # Read PDF
        reader = PdfReader(file_path)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        # Analyze resume
        result = analyze_resume(text)

        return result

    finally:
        # Delete temporary file
        if os.path.exists(file_path):
            os.remove(file_path)