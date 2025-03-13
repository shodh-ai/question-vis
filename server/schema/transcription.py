from pydantic import BaseModel, Field
from typing_extensions import List
from .visualisation import VisualisationResponse as Visualisation


class TranscriptionRequest(BaseModel):
    type: str
    question: str
    answer: List[str]
    visualisation: Visualisation


class TranscriptionResponse(BaseModel):
    text: List[str] = Field(
        description="A list of strings, each string corresponds to an order and tells us what's going on in that frame's order."
    )
