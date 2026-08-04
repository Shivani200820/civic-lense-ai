from sqlalchemy import func

from app.models.user import User
from app.models.complaint import Complaint
from app.models.complaint_support import ComplaintSupport

from app.shared.enums import UserRole
from app.constants.complaint_status import ComplaintStatus

class CitizenAnalyticsRepository:

    def __init__(self, db):
        self.db = db

    def complaints_submitted(self):

        return (
            self.db.query(
                User.full_name,
                func.count(
                    Complaint.id
                ).label("submitted"),
            )
            .outerjoin(
                Complaint,
                Complaint.citizen_id == User.id,
            )
            .filter(
                User.role == UserRole.CITIZEN
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
                Complaint.citizen_id == User.id,
            )
            .filter(
                Complaint.status_id.in_(
                    [
                        ComplaintStatus.PENDING,
                        ComplaintStatus.ACCEPTED,
                        ComplaintStatus.IN_PROGRESS,
                        ComplaintStatus.REOPENED,
                    ]
                )
            )
            .group_by(
                User.id,
                User.full_name,
            )
            .all()
        )

    def closed_complaints(self):

        return (
            self.db.query(
                User.full_name,
                func.count(
                    Complaint.id
                ).label("closed"),
            )
            .join(
                Complaint,
                Complaint.citizen_id == User.id,
            )
            .filter(
                Complaint.status_id == ComplaintStatus.CLOSED
            )
            .group_by(
                User.id,
                User.full_name,
            )
            .all()
        )

    def community_support(self):

        return (
            self.db.query(
                User.full_name,
                func.count(
                    ComplaintSupport.id
                ).label("support_count"),
            )
            .join(
                Complaint,
                Complaint.citizen_id == User.id,
            )
            .outerjoin(
                ComplaintSupport,
                ComplaintSupport.complaint_id == Complaint.id,
            )
            .filter(
                User.role == UserRole.CITIZEN
            )
            .group_by(
                User.id,
                User.full_name,
            )
            .all()
        )