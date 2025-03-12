from typing_extensions import List
from pydantic import BaseModel
from visualisation import VisualisationResponse as Visualisation

class TranscriptionRequest(BaseModel):
    type: str
    question: str
    answer: List[str]
    visualisation: Visualisation

class TranscriptionResponse(BaseModel):
    text: List[str]
