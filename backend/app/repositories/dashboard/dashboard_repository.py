from sqlalchemy import func

from app.models.user import User
from app.models.department import Department
from app.models.complaint import Complaint


class DashboardRepository:

    def __init__(self, db):
        self.db = db

    def total_users(self):
        return self.db.query(
            func.count(User.id)
        ).scalar()


    def total_departments(self):
        return self.db.query(
            func.count(Department.id)
        ).scalar()


    def total_complaints(self):
        return self.db.query(
            func.count(Complaint.id)
        ).scalar()


    def complaints_by_status(
        self,
        status_id,
    ):
        return (
            self.db.query(
                func.count(Complaint.id)
            )
            .filter(
                Complaint.status_id == status_id
            )
            .scalar()
        )