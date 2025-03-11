from pydantic import BaseModel
from typing_extensions import List


class QuestionRequest(BaseModel):
    type: str


class QuestionResponse(BaseModel):
    question: str
    answer: List[str]
    template: List[str]
