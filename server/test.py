import asyncio
import json

from dotenv import load_dotenv

from core import generate_transcription_response
from schema import VisualisationResponse

load_dotenv()


async def main():
    # Uncomment this block if you want to use generate_visualisation_response
    # response = await generate_visualisation_response(
    #     context="",
    #     question="Solve the system of equations for \\( x \\) and \\( y \\): \n\n \\begin{equation} 2x + 3y = 12 \\end{equation} \n \\begin{equation} 4x - y = 5 \\end{equation}",
    #     answer_steps=[
    #         "Multiply the second equation by 3 to align coefficients with the first equation: \\begin{equation} 12x - 3y = 15 \\end{equation}",
    #         "Add the two equations: \\begin{equation} 14x = 27 \\end{equation}",
    #         "Solve for \\( x \\): \\begin{equation} x = 1.92 \\end{equation}",
    #         "Substituting \\( x \\) in the first equation: \\begin{equation} 3.84 + 3y = 12 \\end{equation}",
    #         "Solving for \\( y \\): \\begin{equation} y = 2.72 \\end{equation}"
    #     ]
    # )

    visualisation_data = {
        "layout": [1, 2, 3, 4, 5],
        "elements": [
            {
                "id": 1,
                "type": "equation",
                "frames": [
                    {
                        "equation": "\\begin{align} 2x + 3y &= 12 \\\\ 4x - y &= 5 \\end{align}",
                        "start_order": 0,
                        "end_order": None,
                    }
                ],
            },
            {
                "id": 2,
                "type": "text",
                "frames": [
                    {
                        "text": "Multiply the second equation by 3 to align the y-coefficients",
                        "start_order": 1,
                        "end_order": None,
                    }
                ],
            },
            {
                "id": 3,
                "type": "equation",
                "frames": [
                    {
                        "equation": "\\begin{align} 2x + 3y &= 12 \\\\ 12x - 3y &= 15 \\end{align}",
                        "start_order": 2,
                        "end_order": None,
                    }
                ],
            },
            {
                "id": 4,
                "type": "equation",
                "frames": [
                    {
                        "equation": "\\begin{align} (2x + 3y) + (12x - 3y) &= 12 + 15 \\\\ 14x &= 27 \\\\ x &= \\frac{27}{14} \\\\ x &= 1.92 \\end{align}",
                        "start_order": 3,
                        "end_order": None,
                    }
                ],
            },
            {
                "id": 5,
                "type": "equation",
                "frames": [
                    {
                        "equation": "\\begin{align} 2(1.92) + 3y &= 12 \\\\ 3.84 + 3y &= 12 \\\\ 3y &= 12 - 3.84 \\\\ 3y &= 8.16 \\\\ y &= 2.72 \\end{align}",
                        "start_order": 4,
                        "end_order": None,
                    },
                    {
                        "equation": "\\boxed{\\begin{align} x &= 1.92 \\\\ y &= 2.72 \\end{align}}",
                        "start_order": 5,
                        "end_order": None,
                    },
                ],
            },
        ],
    }

    response = await generate_transcription_response(
        question="Solve the system of equations for \\( x \\) and \\( y \\): \n\n \\begin{equation} 2x + 3y = 12 \\end{equation} \n \\begin{equation} 4x - y = 5 \\end{equation}",
        answer=[
            "Multiply the second equation by 3 to align coefficients with the first equation: \\begin{equation} 12x - 3y = 15 \\end{equation}",
            "Add the two equations: \\begin{equation} 14x = 27 \\end{equation}",
            "Solve for \\( x \\): \\begin{equation} x = 1.92 \\end{equation}",
            "Substituting \\( x \\) in the first equation: \\begin{equation} 3.84 + 3y = 12 \\end{equation}",
            "Solving for \\( y \\): \\begin{equation} y = 2.72 \\end{equation}",
        ],
        visualisation=VisualisationResponse(**visualisation_data),
    )

    if isinstance(response, dict):
        print(json.dumps(response, indent=2))
    else:
        print(response)


if __name__ == "__main__":
    asyncio.run(main())
