from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class ComplaintUpdate(BaseModel):
    title: Optional[str] = Field(
        default=None,
        min_length=5,
        max_length=255,
    )

    description: Optional[str] = Field(
        default=None,
        min_length=10,
        max_length=5000,
    )

    voice_note_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    model_config = ConfigDict(
        from_attributes=True
    )