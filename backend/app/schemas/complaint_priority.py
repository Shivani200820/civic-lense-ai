from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ComplaintPriorityBase(BaseModel):
    """
    Base schema for complaint priorities.
    """

    name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Priority Name",
        examples=["High"],
    )

    description: str | None = Field(
        default=None,
        max_length=500,
        description="Priority Description",
    )

    level: int = Field(
        ...,
        ge=1,
        le=10,
        description="Priority Level",
        examples=[3],
    )

    color: str = Field(
        ...,
        min_length=3,
        max_length=20,
        description="Display Color",
        examples=["Orange"],
    )


class ComplaintPriorityCreate(ComplaintPriorityBase):
    """
    Schema for creating complaint priorities.
    """
    pass


class ComplaintPriorityUpdate(BaseModel):
    """
    Schema for updating complaint priorities.
    """

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    level: int | None = Field(
        default=None,
        ge=1,
        le=10,
    )

    color: str | None = Field(
        default=None,
        min_length=3,
        max_length=20,
    )

    is_active: bool | None = None


class ComplaintPriorityResponse(ComplaintPriorityBase):
    """
    Response schema.
    """

    id: int

    is_active: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )