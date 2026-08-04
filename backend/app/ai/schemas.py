from enum import Enum

from pydantic import BaseModel, Field


class PriorityEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AIComplaintResponse(BaseModel):
    category: str = Field(..., min_length=2, max_length=100)

    department: str = Field(..., min_length=2, max_length=100)

    priority: PriorityEnum

    description: str = Field(..., min_length=10, max_length=500)

    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
    )