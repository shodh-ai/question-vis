import json

from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from typing import List
from pydantic import ValidationError
from pydantic_ai import Agent

from schema import TranscriptionResponse,VisualisationResponse
from fastapi import HTTPException

async def data_validation(content:str) -> TranscriptionResponse | HTTPException:
    try:
        return TranscriptionResponse.model_validate_json(content)
    except ValidationError as e:
        return HTTPException(status_code=500, detail=str(e))

    try:
        agent = Agent(
            "openai:gpt-3.5-turbo",
            result_type=TranscriptionResponse,
            retries=5,
        )
        res = await agent.run(content)
        res = res.data
        return res
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))

async def generate_transcription_response(question: str, answer: List[str], visualisation: VisualisationResponse) -> TranscriptionResponse | HTTPException:
    try:
        chat_model = ChatOpenAI(name="gpt-3.5-turbo")
        prompt_template = PromptTemplate(
            input_variables=["json_data"],
            template="""
You are given a JSON data structure representing a visualization of an educational concept. The JSON contains:

1. **layout**: This represents the visual layout in a grid format. For example, [0, 1, [2, 3], 4, 5] means:
    - The first row contains element 0.
    - The second row contains element 1.
    - The third row contains two equal-sized columns with elements 2 and 3.
    - The fourth row contains element 4.
    - The fifth row contains element 5.

2. **elements**: This is an array of objects. Each object has:
    - **id**: The unique identifier for the element.
    - **frames**: The content shown in that element.
        - **type**: tells you the type of object in frame (svg image, graph, table, latex equation or simple text)
        - **text**: The LaTeX or text content for that element.
        - **start_order**: When the content starts appearing, order-wise.
        - **end_order**: When the content stops appearing, order-wise. Null means it stays till the end.

Your task is to generate a natural, human-like conversational transcript for this visualization as a whole, not for individual elements.

The transcript should follow this format strictly:

[{{TIME}}-X] <Human-like transcription>

where {{TIME}} will be filled later and X is the element ID. The language should be natural, easy to understand, and engaging. Avoid technical jargon and make it sound like a teacher explaining the concept.

The transcript should be continuous, like a teacher speaking without interruptions. Avoid adding any additional formatting like Python arrays, JSON, or code. Only the pure conversational text chunk should appear.

Now generate the entire transcript as a whole.

JSON Data:
{json_data}

Generate now:
"""
        )
        full_prompt = prompt_template.format(
            json_data=json.dumps(visualisation.dict())
        )
        response = chat_model.invoke(full_prompt)
        content = response.content
        if content is None:
           return HTTPException(status_code=500, detail="No response received")
        elif isinstance(content, list):
            first_item = content[0] if content else None
            if isinstance(first_item, str):
                res = await data_validation(first_item)
                return res
            elif isinstance(first_item, dict):
                transcript = TranscriptionResponse(**first_item)
                return transcript
            else:
                return HTTPException(status_code=500, detail="First item in content list is neither a string nor a dictionary.")
        elif isinstance(content, str):
            res = await data_validation(content)
            return res
        else:
            return HTTPException(status_code=500, detail="Unexpected response content type.")
    except (json.JSONDecodeError, ValidationError) as e:
        return HTTPException(status_code=500, detail=f"Error processing response content: {e}")
