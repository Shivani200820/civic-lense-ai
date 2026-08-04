from sqlalchemy import func

from app.models.complaint import Complaint
from app.models.department import Department
from app.constants.complaint_status import ComplaintStatus

class DepartmentAnalyticsRepository:

    def __init__(self, db):
        self.db = db

    def complaints_by_department(self):

        return (
            self.db.query(
                Department.name,
                func.count(
                    Complaint.id
                ).label("total"),
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

    def pending_by_department(self):

        return (
            self.db.query(
                Department.name,
                func.count(
                    Complaint.id
                ).label("pending"),
            )
            .join(
                Complaint,
                Complaint.department_id == Department.id,
            )
            .filter(
                Complaint.status_id == ComplaintStatus.PENDING
            )
            .group_by(
                Department.name
            )
            .all()
        )

    def resolved_by_department(self):

        return (
            self.db.query(
                Department.name,
                func.count(
                    Complaint.id
                ).label("resolved"),
            )
            .join(
                Complaint,
                Complaint.department_id == Department.id,
            )
            .filter(
                Complaint.status_id == ComplaintStatus.RESOLVED
            )
            .group_by(
                Department.name
            )
            .all()
        )

    def average_resolution_time(self):

        return (
            self.db.query(
                Department.name,

                func.avg(
                    Complaint.resolution_duration_hours
                ).label(
                    "avg_hours"
                ),
            )
            .join(
                Complaint,
                Complaint.department_id == Department.id,
            )
            .filter(
                Complaint.resolution_duration_hours.isnot(None)
            )
            .group_by(
                Department.name
            )
            .all()
        )