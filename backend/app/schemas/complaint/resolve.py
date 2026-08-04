from pydantic import BaseModel, Field


class ComplaintResolveRequest(BaseModel):

    resolution_remarks: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Remarks provided by the officer after resolving the complaint.",
        examples=["The pothole has been repaired and the road is now safe for traffic."],
    )

    resolution_image_url: str | None = Field(
        default=None,
        max_length=500,
        description="URL of the image uploaded as proof of complaint resolution.",
        examples=["https://example.com/resolution-image.jpg"],
    )