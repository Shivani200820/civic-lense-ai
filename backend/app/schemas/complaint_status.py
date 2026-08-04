from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ComplaintStatusBase(BaseModel):
    """
    Common fields for complaint status.
    """

    name: str = Field(
        ...,
        min_length=2,
        max_length=50,
        description="Complaint Status Name",
        examples=["Pending"],
    )


    description: str | None = Field(
        default=None,
        max_length=500,
        description="Status Description",
    )


    sequence: int = Field(
        ...,
        ge=1,
        le=20,
        description="Workflow Sequence Number",
        examples=[1],
    )


    is_final: bool = Field(
        default=False,
        description="Indicates final workflow status",
    )


class ComplaintStatusCreate(
    ComplaintStatusBase
):
    """
    Schema used when creating status.
    """

    pass



class ComplaintStatusUpdate(BaseModel):
    """
    Schema used for updating status.
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


    sequence: int | None = Field(
        default=None,
        ge=1,
        le=20,
    )


    is_final: bool | None = None


    is_active: bool | None = None



class ComplaintStatusResponse(
    ComplaintStatusBase
):
    """
    Response schema returned by API.
    """

    id: int

    is_active: bool

    created_at: datetime

    updated_at: datetime


    model_config = ConfigDict(
        from_attributes=True
    )