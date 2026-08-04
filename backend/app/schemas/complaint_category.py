from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ComplaintCategoryBase(BaseModel):
    """
    Base schema for complaint categories.
    """

    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Complaint Category Name",
        examples=["Garbage"],
    )

    description: str | None = Field(
        default=None,
        max_length=500,
        description="Complaint Category Description",
    )


class ComplaintCategoryCreate(ComplaintCategoryBase):
    """
    Schema for creating a complaint category.
    """
    pass


class ComplaintCategoryUpdate(BaseModel):
    """
    Schema for updating a complaint category.
    """

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    is_active: bool | None = None


class ComplaintCategoryResponse(ComplaintCategoryBase):
    """
    Schema returned to API clients.
    """

    id: int

    is_active: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )