from sqlalchemy import func

from app.models.complaint import Complaint
from app.models.department import Department
from app.models.user import User

class ChartRepository:

    def __init__(self, db):
        self.db = db

    def complaint_status_chart(self):

        return (
            self.db.query(
                Complaint.status_id,
                func.count(Complaint.id).label("count"),
            )
            .group_by(
                Complaint.status_id
            )
            .all()
        )

    def department_chart(self):

        return (
            self.db.query(
                Department.name,
                func.count(
                    Complaint.id
                ).label("count"),
            )
            .join(
                Complaint,
                Complaint.department_id == Department.id,
            )
            .group_by(
                Department.name
            )
            .all()
        )

    def monthly_trend(self):

        return (
            self.db.query(
                func.month(
                    Complaint.created_at
                ).label("month"),

                func.count(
                    Complaint.id
                ).label("count"),
            )
            .group_by(
                func.month(
                    Complaint.created_at
                )
            )
            .order_by(
                func.month(
                    Complaint.created_at
                )
            )
            .all()
        )

    def officer_workload_chart(self):

        return (
            self.db.query(
                User.full_name,

                func.count(
                    Complaint.id
                ).label("assigned"),
            )
            .join(
                Complaint,
                Complaint.assigned_officer_id == User.id,
            )
            .group_by(
                User.full_name
            )
            .all()
        )

    def citizen_chart(self):

        return (
            self.db.query(
                User.full_name,

                func.count(
                    Complaint.id
                ).label("submitted"),
            )
            .join(
                Complaint,
                Complaint.citizen_id == User.id,
            )
            .group_by(
                User.full_name
            )
            .all()
        )