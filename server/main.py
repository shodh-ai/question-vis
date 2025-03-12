import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schema import QuestionRequest, VisualisationRequest, TranscriptionRequest
from core import generate_visualisation_response, generate_transcription_response

app = FastAPI()
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url = os.getenv("BACKEND_URL", "localhost")
port = int(os.getenv("BACKEND_PORT", 8000))
questions = json.loads(open("data/questions.json", "r").read())


@app.get("/")
def root():
    try:
        return {"text": "Hello World"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/questions")
async def get_questions(req: QuestionRequest):
    try:
        if req.type == "example":
            return questions[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/visualisations")
async def get_visualisations(req: VisualisationRequest):
    try:
        if req.type == "example":
            return generate_visualisation_response(req.context, req.question, req.answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transcription")
async def get_transcription(req:TranscriptionRequest):
    try:
        if req.type == "example":
            return generate_transcription_response(req.question, req.answer, req.visualisation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=url, port=port)
