from datetime import datetime
from pydantic import BaseModel


class ComplaintHistoryResponse(BaseModel):

    id: int
    complaint_id: int

    old_status_id: int
    new_status_id: int

    changed_by: int

    remarks: str | None = None

    created_at: datetime

    class Config:
        from_attributes = True