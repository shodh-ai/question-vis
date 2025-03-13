import json
from typing import List

from fastapi import HTTPException
from langchain.prompts import PromptTemplate
from langchain_anthropic import ChatAnthropic
from pydantic import ValidationError
from pydantic_ai import Agent

from schema import VisualisationResponse


async def data_validation(content: str) -> VisualisationResponse | HTTPException:
    try:
        return VisualisationResponse.model_validate_json(content)
    except ValidationError as e:
        return HTTPException(status_code=500, detail=str(e))

    try:
        agent = Agent(
            "openai:gpt-3.5-turbo",
            result_type=VisualisationResponse,
            retries=5,
        )
        res = await agent.run(content)
        res = res.data
        return res
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))


async def generate_visualisation_response(
    context: str, question: str, answer_steps: List[str]
) -> VisualisationResponse | HTTPException:
    chat_model = ChatAnthropic(
        model_name="claude-3-sonnet-20240229", timeout=None, stop=None
    )
    prompt_template = PromptTemplate(
        input_variables=["context", "question", "answer_steps"],
        template="""
You are an AI responsible for creating a dynamic JSON for educational visualizations.

## Context
{context}

## Question
{question}

## Answer
{answer_steps}

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
          "text": "The text here",
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
1. **Layout:**
   - Follow a layout like `[1, [2, 3], 4]`. Rows with multiple elements should be visually connected.
   - Ensure logical flow in the layout matching the sequential answer steps.
   - The number of entries in layout must match the number of elements.

2. **Frames:**
   - Each step in the answer must map to a visual element (text or equation).
   - If the step contains a formula, use an **equation frame**. For text, use a **text frame**.
   - Multiple frames in the same element should indicate progressive steps (like showing a formula and then calculating it).

3. **Start and End Order:**
   - Start the first frame with `start_order=0` and increase sequentially.
   - If an element stays visible till the end, set `end_order=null`. Otherwise, specify an integer for its disappearance.

4. **Equation Frame Rules:**
   - All mathematical content must use the **EquationFrame** format:
   ```json
   {
     "type": "equation",
     "text": "LaTeX equation",
     "start_order": 1,
     "end_order": null
   }
   ```
   - Ensure LaTeX syntax is clean and precise.

5. **Grouping Elements:**
    - Group connected content (text + equation or multi-step calculations) side-by-side where relevant.
    - Use justified grid layouts for such groupings.

6. **Strict Output:**
    - Only generate pure JSON output. Avoid any explanations, markdown, or extra text.
    - Ensure it follows the exact format.

## Expected Output
A pure JSON following the structure defined without any explanation or markdown.
Output:
""",
    )

    # ## Special Handling Instructions
    # 1. **Graphs:**
    # {graph_instructions}

    # 2. **Tables:**
    # {table_instructions}

    # 3. **Images or Vector Diagrams:**
    # {image_instructions}

    full_prompt = prompt_template.format(
        context=context, question=question, answer_steps=answer_steps
    )

    response = chat_model.invoke(full_prompt)
    content = response.content

    try:
        if content is None:
            return HTTPException(status_code=500, detail="No response received")
        elif isinstance(content, list):
            first_item = content[0] if content else None
            if isinstance(first_item, str):
                res = await data_validation(first_item)
                return res
            elif isinstance(first_item, dict):
                visualization_json = VisualisationResponse(**first_item)
                return visualization_json
            else:
                return HTTPException(
                    status_code=500,
                    detail="First item in content list is neither a string nor a dictionary.",
                )
        elif isinstance(content, str):
            res = await data_validation(content)
            return res
        else:
            return HTTPException(
                status_code=500, detail="Unexpected response content type."
            )
    except (json.JSONDecodeError, ValidationError) as e:
        return HTTPException(
            status_code=500, detail=f"Error processing response content: {e}"
        )
