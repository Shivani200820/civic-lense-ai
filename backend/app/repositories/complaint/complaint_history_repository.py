from sqlalchemy.orm import Session

from app.models.complaint_history import ComplaintHistory


class ComplaintHistoryRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        history: ComplaintHistory,
    ) -> ComplaintHistory:

        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)

        return history
    
    def get_history(
        self,
        complaint_id: int,
    ):
        return (
            self.db.query(ComplaintHistory)
            .filter(
                ComplaintHistory.complaint_id == complaint_id
            )
            .order_by(
                ComplaintHistory.created_at.asc()
            )
            .all()
        )