from app.repositories.dashboard.recent_activity_repository import (
    RecentActivityRepository,
)
from app.constants.complaint_status import ComplaintStatus

STATUS_NAMES = {
    ComplaintStatus.PENDING: "Pending",
    ComplaintStatus.ACCEPTED: "Accepted",
    ComplaintStatus.IN_PROGRESS: "In Progress",
    ComplaintStatus.RESOLVED: "Resolved",
    ComplaintStatus.CLOSED: "Closed",
    ComplaintStatus.REOPENED: "Reopened",
    ComplaintStatus.REJECTED: "Rejected",
}

class RecentActivityService:

    def __init__(self, db):
        self.repo = RecentActivityRepository(db)

    def get_recent_activity(self):

        return {

            "recent_complaints": [
                {
                    "id": complaint.id,
                    "complaint_number": complaint.complaint_number,
                    "title": complaint.title,
                    "created_at": complaint.created_at,
                }
                for complaint in self.repo.recent_complaints()
            ],

            "recent_status_changes": [
                {
                    "complaint_id": history.complaint_id,
                    "old_status": STATUS_NAMES.get(
                        history.old_status_id,
                        "Unknown",
                    ),
                    "new_status": STATUS_NAMES.get(
                        history.new_status_id,
                        "Unknown",
                    ),
                    "created_at": history.created_at,
                }
                for history in self.repo.recent_status_changes()
            ],

            "recent_users": [
                {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "created_at": user.created_at,
                }
                for user in self.repo.recent_users()
            ],
        }