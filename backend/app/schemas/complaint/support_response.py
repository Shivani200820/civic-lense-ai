from pydantic import BaseModel


class ComplaintSupportResponse(BaseModel):
    message: str
    support_count: int