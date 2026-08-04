from typing import Literal

from pydantic import BaseModel, Field


class CitizenConfirmationRequest(BaseModel):

    decision: Literal["close", "reopen"] = Field(
        ...,
        description="Citizen's decision after reviewing the resolved complaint.",
        examples=["close"],
    )

    feedback: str | None = Field(
        default=None,
        max_length=500,
        description="Citizen's feedback about the complaint resolution.",
        examples=["The issue has been resolved properly."],
    )

    rating: int | None = Field(
        default=None,
        ge=1,
        le=5,
        description="Citizen's rating for the complaint resolution (1 to 5).",
        examples=[5],
    )