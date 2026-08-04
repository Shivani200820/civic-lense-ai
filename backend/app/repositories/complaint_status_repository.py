from sqlalchemy.orm import Session

from app.models.complaint_status import ComplaintStatus

from app.schemas.complaint_status import (
    ComplaintStatusCreate,
    ComplaintStatusUpdate,
)


class ComplaintStatusRepository:
    """
    Handles database operations
    related to complaint statuses.
    """


    def __init__(
        self,
        db: Session
    ):
        self.db = db



    def get_by_id(
        self,
        status_id: int,
    ) -> ComplaintStatus | None:

        return (
            self.db.query(ComplaintStatus)
            .filter(
                ComplaintStatus.id == status_id
            )
            .first()
        )



    def get_by_name(
        self,
        name: str,
    ) -> ComplaintStatus | None:

        return (
            self.db.query(ComplaintStatus)
            .filter(
                ComplaintStatus.name == name
            )
            .first()
        )



    def get_by_sequence(
        self,
        sequence: int,
    ) -> ComplaintStatus | None:

        return (
            self.db.query(ComplaintStatus)
            .filter(
                ComplaintStatus.sequence == sequence
            )
            .first()
        )



    def get_all(
        self,
    ) -> list[ComplaintStatus]:

        return (
            self.db.query(ComplaintStatus)
            .order_by(
                ComplaintStatus.sequence.asc()
            )
            .all()
        )



    def create(
        self,
        status_data: ComplaintStatusCreate,
    ) -> ComplaintStatus:


        status = ComplaintStatus(
            name=status_data.name,
            description=status_data.description,
            sequence=status_data.sequence,
            is_final=status_data.is_final,
        )


        self.db.add(status)

        self.db.commit()

        self.db.refresh(status)


        return status



    def update(
        self,
        status: ComplaintStatus,
        status_data: ComplaintStatusUpdate,
    ) -> ComplaintStatus:


        update_data = status_data.model_dump(
            exclude_unset=True
        )


        for key, value in update_data.items():

            setattr(
                status,
                key,
                value
            )


        self.db.commit()

        self.db.refresh(status)


        return status



    def activate(
        self,
        status: ComplaintStatus,
    ) -> ComplaintStatus:


        status.is_active = True


        self.db.commit()

        self.db.refresh(status)


        return status



    def deactivate(
        self,
        status: ComplaintStatus,
    ) -> ComplaintStatus:


        status.is_active = False


        self.db.commit()

        self.db.refresh(status)


        return status



    def delete(
        self,
        status: ComplaintStatus,
    ) -> None:


        self.db.delete(status)

        self.db.commit()