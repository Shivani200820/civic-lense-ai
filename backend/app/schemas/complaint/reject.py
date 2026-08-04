from pydantic import BaseModel, Field


class ComplaintRejectRequest(BaseModel):

    reason: str = Field(
        ...,
        min_length=10,
        max_length=500,
        description="Reason for rejecting the complaint.",
        examples=["The uploaded image is unclear and does not match the complaint."],
    )