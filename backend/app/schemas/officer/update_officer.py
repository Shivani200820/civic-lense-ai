from pydantic import BaseModel, Field

from app.shared.constants import (
    MAX_NAME_LENGTH,
    MAX_PHONE_LENGTH,
)


class OfficerUpdate(BaseModel):

    full_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=MAX_NAME_LENGTH,
    )

    phone: str | None = Field(
        default=None,
        min_length=10,
        max_length=MAX_PHONE_LENGTH,
    )

    language: str | None = None

    department_id: int | None = None