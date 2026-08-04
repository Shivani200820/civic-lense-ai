import json

from pydantic import ValidationError

from app.ai.schemas import AIComplaintResponse


class AIResponseParser:

    @staticmethod
    def parse(response: str) -> AIComplaintResponse:

        try:
            data = json.loads(response)

        except json.JSONDecodeError:
            raise ValueError(
                "AI returned invalid JSON."
            )

        try:
            return AIComplaintResponse.model_validate(
                data
            )

        except ValidationError as e:
            raise ValueError(
                f"AI validation failed: {e}"
            )