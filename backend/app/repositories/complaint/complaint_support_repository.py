from sqlalchemy.orm import Session

from app.models.complaint_support import ComplaintSupport


class ComplaintSupportRepository:

    def __init__(self, db: Session):
        self.db = db

    def exists(
        self,
        complaint_id: int,
        citizen_id: int,
    ) -> bool:

        return (
            self.db.query(ComplaintSupport)
            .filter(
                ComplaintSupport.complaint_id == complaint_id,
                ComplaintSupport.citizen_id == citizen_id,
            )
            .first()
            is not None
        )

    def create(
        self,
        support: ComplaintSupport,
    ):

        self.db.add(support)
        self.db.commit()
        self.db.refresh(support)

        return support

    def count(
        self,
        complaint_id: int,
    ):

        return (
            self.db.query(ComplaintSupport)
            .filter(
                ComplaintSupport.complaint_id == complaint_id
            )
            .count()
        )