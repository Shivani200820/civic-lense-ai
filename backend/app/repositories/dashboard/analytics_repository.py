from sqlalchemy import func

from app.models.complaint import Complaint
from app.models.complaint_category import ComplaintCategory
from app.models.department import Department
from datetime import datetime, timedelta



class AnalyticsRepository:

    def __init__(self, db):
        self.db = db

    def complaints_today(self):

        return (
            self.db.query(
                func.count(Complaint.id)
            )
            .filter(
                func.date(
                    Complaint.created_at
                ) == func.current_date()
            )
            .scalar()
        )
    
    def complaints_this_month(self):

        return (
            self.db.query(
                func.count(
                    Complaint.id
                )
            )
            .filter(
                func.month(
                    Complaint.created_at
                ) == func.month(
                    func.current_date()
                ),
                func.year(
                    Complaint.created_at
                ) == func.year(
                    func.current_date()
                ),
            )
            .scalar()
        )
    
    def complaints_by_category(self):

        return (
            self.db.query(
                ComplaintCategory.name,
                func.count(
                    Complaint.id
                ).label("count"),
            )
            .join(
                Complaint,
                Complaint.category_id == ComplaintCategory.id,
            )
            .group_by(
                ComplaintCategory.name
            )
            .all()
        )
    
    def complaints_by_department(self):

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
    

    def complaints_last_7_days(self):

        return (
            self.db.query(
                func.date(Complaint.created_at).label("date"),
                func.count(Complaint.id).label("count"),
            )
            .filter(
                Complaint.created_at >= datetime.utcnow() - timedelta(days=6)
            )
            .group_by(
                func.date(Complaint.created_at)
            )
            .order_by(
                func.date(Complaint.created_at)
            )
            .all()
        )