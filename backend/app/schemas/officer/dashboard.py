from pydantic import BaseModel


class OfficerDashboardResponse(BaseModel):
    total_complaints: int
    pending: int
    accepted: int
    in_progress: int
    resolved: int
    reopened: int