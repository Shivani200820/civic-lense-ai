from pydantic import BaseModel

class ComplaintImageResponse(BaseModel):
    id: int
    complaint_number: str
    image_url: str
    category: str
    department: str
    priority: str
    description: str