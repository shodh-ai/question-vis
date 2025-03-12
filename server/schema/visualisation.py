from typing import Optional

from pydantic import BaseModel, Field
from typing_extensions import List


class TextFrame(BaseModel):
    text: str = Field(description="The text to display on the page")
    start_order: int = Field(description="The order in which it appears in animation")
    end_order: Optional[int] = Field(
        description="The order in which it disappears in animation. None if it does not disappear till the end"
    )


class EquationFrame(BaseModel):
    equation: str = Field(description="The equation to display on the page")
    start_order: int = Field(description="The order in which it appears in animation")
    end_order: Optional[int] = Field(
        description="The order in which it disappears in animation. None if it does not disappear till the end"
    )


class Element(BaseModel):
    id: int = Field(description="The unique identifier of the element")
    type: str = Field(
        description="The type of the element: text, equation, graph, image or table"
    )
    frames: List[TextFrame | EquationFrame] = Field(
        description="The frames of the element"
    )


class VisualisationResponse(BaseModel):
    layout: List[int | List[int]] = Field(
        description="The layout of the visualisation in a 2-dimensional grid. Each element is a row and each element in element is the column"
    )
    elements: List[Element] = Field(description="The elements of the visualisation")


class VisualisationRequest(BaseModel):
    type: str
    context: str
    question: str
    answer: List[str]
