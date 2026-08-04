from app.models.complaint import Complaint
from app.models.complaint_history import ComplaintHistory
from app.models.user import User


class RecentActivityRepository:

    def __init__(self, db):
        self.db = db

    def recent_complaints(self, limit=10):

        return (
            self.db.query(Complaint)
            .order_by(Complaint.created_at.desc())
            .limit(limit)
            .all()
        )

    def recent_status_changes(self, limit=10):

        return (
            self.db.query(ComplaintHistory)
            .order_by(ComplaintHistory.created_at.desc())
            .limit(limit)
            .all()
        )

    def recent_users(self, limit=10):

        return (
            self.db.query(User)
            .order_by(User.created_at.desc())
            .limit(limit)
            .all()
        )