import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schema import QuestionRequest

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=url, port=port)
