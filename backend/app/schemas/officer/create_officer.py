from pydantic import BaseModel, EmailStr, Field

from app.shared.constants import (
    MAX_NAME_LENGTH,
    MAX_PHONE_LENGTH,
)


class OfficerCreate(BaseModel):

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=MAX_NAME_LENGTH,
    )

    email: EmailStr

    phone: str = Field(
        ...,
        min_length=10,
        max_length=MAX_PHONE_LENGTH,
    )

    password: str = Field(
        ...,
        min_length=8,
    )

    department_id: int

    language: str = "English"