import json

from langchain.prompts import PromptTemplate
from langchain_anthropic import ChatAnthropic
from pydantic import ValidationError
from pydantic_ai import Agent

from schema import VisualisationResponse
from fastapi import HTTPException


async def generate_visualisation_response(context: str, question: str, graph_instructions: str, table_instructions: str, image_instructions: str) -> VisualisationResponse | HTTPException:
    chat_model = ChatAnthropic(
        model_name="claude-3-sonnet-20240229", timeout=None, stop=None
    )
    prompt_template = PromptTemplate(
        input_variables=[
            "context",
            "question",
            "graph_instructions",
            "table_instructions",
            "image_instructions",
        ],
        template="""
You are an AI responsible for creating a dynamic JSON for educational visualizations.

## Context
{context}

## Question
{question}

## Output Format
You need to generate a JSON with the following structure:

{
  "layout": [1, [2, 3], 4],
  "elements": [
    {
      "id": 1,
      "frames": [
        {
          "type": "text",
          "text": "The text or equation here",
          "start_order": 0,
          "end_order": null
        }
      ]
    },
    {
      "id": 2,
      "frames": [
        {
          "type": "equation",
          "text": "LaTeX equation here",
          "start_order": 1,
          "end_order": null
        }
      ]
    }
  ]
}

## Rules for JSON Generation
1. **Layout:** Follow the pattern for layout as `[1, [2, 3], 4]`. The rows with multiple elements should be justified and look visually connected.
2. **Frames:** Each element can have multiple frames (like text → equation → answer).
3. **End Order:** If content stays visible until the end, set `"end_order": null`. Otherwise, use an integer for when it should disappear.
4. **No Markdown Output:** Only output pure JSON. No text, no explanations.

## Special Handling Instructions
1. **Graphs:**
{graph_instructions}

2. **Tables:**
{table_instructions}

3. **Images or Vector Diagrams:**
{image_instructions}

## Expected Output
You must only generate a pure JSON without any additional explanation or text.
Output:
""",
)

    context = "We are teaching the concept of arithmetic mean using a dataset of numbers."
    question = "How do you calculate the mean of the data: {4, 7, 10, 5, 8}?"
    graph_instructions = "If a graph is needed, generate a simple bar graph with 'Data Points' on X-axis and 'Values' on Y-axis."
    table_instructions = "If a table is needed, generate a simple 2-column table with 'Data Point' and 'Value'."
    image_instructions = "If an image is needed, it can be a simple line chart or vector diagram to visualize the concept."

    full_prompt = prompt_template.format(
        context=context,
        question=question,
        graph_instructions=graph_instructions,
        table_instructions=table_instructions,
        image_instructions=image_instructions,
    )

    response = chat_model.invoke(full_prompt)
    content = response.content

    try:
        if content is None:
           return HTTPException(status_code=500, detail="No response received")
        elif isinstance(content, list):
            first_item = content[0] if content else None
            if isinstance(first_item, str):
                visualization_json = VisualisationResponse.model_validate_json(first_item)
            elif isinstance(first_item, dict):
                visualization_json = VisualisationResponse(**first_item)
            else:
                raise ValueError("First item in content list is neither a string nor a dictionary.")
        elif isinstance(content, str):
            visualization_json = VisualisationResponse.model_validate_json(content)
        else:
            raise ValueError("Unexpected response content type.")
    except (json.JSONDecodeError, ValidationError) as e:
        try:
            agent = Agent(
                "openai:gpt-3.5-turbo",
                result_type=VisualisationResponse,
                retries=5,
            )
            res = await agent.run(content)
            res = res.data
        raise ValueError(f"Error processing response content: {e}")

    return visualization_json
