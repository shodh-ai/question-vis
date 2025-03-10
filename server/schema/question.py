from typing_extensions import List
from pydantic import BaseModel

class QuestionRequest(BaseModel):
    type: str

class QuestionResponse(BaseModel):
    question: str
    answer: List[str]
    template: List[str]
