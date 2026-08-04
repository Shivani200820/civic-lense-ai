from sqlalchemy.orm import Session
from sqlalchemy import asc, desc

from app.models.complaint import Complaint

class ComplaintQueryRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_query(self):
        return self.db.query(Complaint)
    
    def filter_by_citizen(
        self,
        citizen_id: int,
    ):

        return (
            self.get_query()
            .filter(
                Complaint.citizen_id == citizen_id
            )
        )
    
    def filter_by_status(
        self,
        status_id: int,
    ):

        return (
            self.get_query()
            .filter(
                Complaint.status_id == status_id
            )
        )
    
    def filter_by_department(
        self,
        department_id: int,
    ):

        return (
            self.get_query()
            .filter(
                Complaint.department_id == department_id
            )
        )
    
    def search_title(
        self,
        keyword: str,
    ):

        return (
            self.get_query()
            .filter(
                Complaint.title.ilike(
                    f"%{keyword}%"
                )
            )
        )
    
    def paginate(
        self,
        query,
        page: int,
        page_size: int,
    ):

        return (
            query
            .offset(
                (page - 1) * page_size
            )
            .limit(page_size)
            .all()
        )
    
    def sort(
        self,
        query,
        field: str = "created_at",
        order: str = "desc",
    ):

        column = getattr(
            Complaint,
            field,
        )

        if order.lower() == "asc":
            return query.order_by(
                asc(column)
            )

        return query.order_by(
            desc(column)
        )