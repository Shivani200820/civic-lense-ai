from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DepartmentBase(BaseModel):
    """
    Common Department fields.
    """

    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Department Name",
        examples=["Sanitation"]
    )

    description: str | None = Field(
        default=None,
        max_length=500,
        description="Department Description"
    )


class DepartmentCreate(DepartmentBase):
    """
    Schema for creating a department.
    """
    pass


class DepartmentUpdate(BaseModel):
    """
    Schema for updating a department.
    """

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    is_active: bool | None = None


class DepartmentResponse(DepartmentBase):
    """
    Schema returned to clients.
    """

    id: int

    is_active: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )