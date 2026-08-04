from sqlalchemy import func

from app.models.user import User
from app.models.complaint import Complaint
from app.shared.enums import UserRole
from app.constants.complaint_status import ComplaintStatus

class OfficerAnalyticsRepository:

    def __init__(self, db):
        self.db = db

    def officer_workload(self):

        return (
            self.db.query(
                User.full_name,
                func.count(
                    Complaint.id
                ).label("assigned"),
            )
            .outerjoin(
                Complaint,
                Complaint.assigned_officer_id == User.id,
            )
            .filter(
                User.role == UserRole.OFFICER
            )
            .group_by(
                User.id,
                User.full_name,
            )
            .all()
        )

    def resolved_complaints(self):

        return (
            self.db.query(
                User.full_name,
                func.count(
                    Complaint.id
                ).label("resolved"),
            )
            .join(
                Complaint,
                Complaint.assigned_officer_id == User.id,
            )
            .filter(
                Complaint.status_id.in_(
                    [
                        ComplaintStatus.RESOLVED,
                        ComplaintStatus.CLOSED,
                    ]
                )
            )
            .group_by(
                User.id,
                User.full_name,
            )
            .all()
        )

    def average_resolution_time(self):

        return (
            self.db.query(
                User.full_name,
                func.avg(
                    Complaint.resolution_duration_hours
                ).label("avg_hours"),
            )
            .join(
                Complaint,
                Complaint.assigned_officer_id == User.id,
            )
            .filter(
                Complaint.resolution_duration_hours.isnot(None)
            )
            .group_by(
                User.id,
                User.full_name,
            )
            .all()
        )

    def active_complaints(self):

        return (
            self.db.query(
                User.full_name,
                func.count(
                    Complaint.id
                ).label("active"),
            )
            .join(
                Complaint,
                Complaint.assigned_officer_id == User.id,
            )
            .filter(
                Complaint.status_id.in_(
                    [
                        ComplaintStatus.ACCEPTED,
                        ComplaintStatus.IN_PROGRESS,
                    ]
                )
            )
            .group_by(
                User.id,
                User.full_name,
            )
            .all()
        )