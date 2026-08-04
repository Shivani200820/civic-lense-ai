from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class ComplaintCreate(BaseModel):

    title: str | None = Field(
        default=None,
        min_length=5,
        max_length=255,
        description="Short title of the complaint.",
        examples=["Large pothole on Main Road"],
    )

    description: str | None = Field(
        default=None,
        min_length=10,
        max_length=5000,
        description="Detailed description of the complaint.",
        examples=["There is a large pothole near the bus stop causing traffic issues."],
    )

    ai_title: str | None = Field(
        default=None,
        description="AI generated title."
    )

    latitude: float = Field(
        ...,
        ge=-90,
        le=90,
        description="Latitude of the complaint location.",
        examples=[18.5913],
    )

    longitude: float = Field(
        ...,
        ge=-180,
        le=180,
        description="Longitude of the complaint location.",
        examples=[73.7389],
    )

    voice_note_url: Optional[str] = Field(
        default=None,
        max_length=500,
        description="Optional voice note URL uploaded by the citizen.",
        examples=["https://example.com/audio.mp3"],
    )

    image_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    ai_category: Optional[str] = None

    ai_department: Optional[str] = None

    ai_priority: Optional[str] = None

    ai_description: Optional[str] = None

    ai_confidence: Optional[float] = None

    final_category_id: int | None = Field(
        default=None,
        description="Final category selected by the citizen.",
        examples=[1],
    )

    final_department_id: int | None = Field(
        default=None,
        description="Final department selected by the citizen.",
        examples=[2],
    )

    final_priority_id: int | None = Field(
        default=None,
        description="Final priority selected by the citizen.",
        examples=[1],
    )

    final_description: str | None = Field(
        default=None,
        max_length=5000,
        description="Final complaint description after citizen confirmation.",
        examples=["Large pothole on Main Road near the traffic signal."],
    )

    model_config = ConfigDict(
        from_attributes=True
    )