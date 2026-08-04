from pydantic import BaseModel


class OfficerStatusUpdate(BaseModel):
    is_active: bool