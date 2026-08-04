from sqlalchemy.orm import Session

from app.models.complaint import Complaint
from app.constants.complaint_status import ComplaintStatus

class ComplaintRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        complaint: Complaint,
    ) -> Complaint:

        self.db.add(complaint)

        self.db.commit()

        self.db.refresh(complaint)

        return complaint
    
    def get_by_id(
        self,
        complaint_id: int,
    ) -> Complaint | None:

        return (
            self.db.query(Complaint)
            .filter(
                Complaint.id == complaint_id
            )
            .first()
        )
    
    def get_by_number(
        self,
        complaint_number: str,
    ) -> Complaint | None:

        return (
            self.db.query(Complaint)
            .filter(
                Complaint.complaint_number == complaint_number
            )
            .first()
        )
    
    def list(
        self,
        page: int = 1,
        page_size: int = 10,
    ) -> list[Complaint]:

        return (
            self.db.query(Complaint)
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
    
    def get_by_citizen(
        self,
        citizen_id: int,
    ) -> list[Complaint]:

        return (
            self.db.query(Complaint)
            .filter(
                Complaint.citizen_id == citizen_id
            )
            .all()
        )
    
    def update(
        self,
        complaint: Complaint,
    ) -> Complaint:

        self.db.commit()

        self.db.refresh(complaint)

        return complaint
    
    def delete(
        self,
        complaint: Complaint,
    ) -> None:

        self.db.delete(complaint)

        self.db.commit()


    def save(
        self,
        complaint: Complaint,
    ):
        self.db.commit()
        self.db.refresh(complaint)
        return complaint
    
    def get_by_department(
        self,
        department_id: int,
    ):
        return (
            self.db.query(Complaint)
            .filter(
                Complaint.department_id == department_id
            )
            .all()
        )
    
    def dashboard_counts(
        self,
        department_id: int,
    ):
        query = (
            self.db.query(Complaint)
            .filter(
                Complaint.department_id == department_id
            )
        )

        return {
            "total_complaints": query.count(),
            "pending": query.filter(
                Complaint.status_id == ComplaintStatus.PENDING
            ).count(),
            "accepted": query.filter(
                Complaint.status_id == ComplaintStatus.ACCEPTED
            ).count(),
            "in_progress": query.filter(
                Complaint.status_id == ComplaintStatus.IN_PROGRESS
            ).count(),
            "resolved": query.filter(
                Complaint.status_id == ComplaintStatus.RESOLVED
            ).count(),
            "reopened": query.filter(
                Complaint.status_id == ComplaintStatus.REOPENED
            ).count(),
        }