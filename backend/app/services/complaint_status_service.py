from sqlalchemy.orm import Session

from app.core.exceptions import (
    ComplaintStatusAlreadyExistsException,
    ComplaintStatusSequenceExistsException,
    ComplaintStatusNotFoundException,
)

from app.models.complaint_status import ComplaintStatus

from app.repositories.complaint_status_repository import (
    ComplaintStatusRepository,
)

from app.schemas.complaint_status import (
    ComplaintStatusCreate,
    ComplaintStatusUpdate,
)


class ComplaintStatusService:
    """
    Business logic for complaint statuses.
    """


    def __init__(
        self,
        db: Session,
    ):

        self.repository = ComplaintStatusRepository(db)



    def create_status(
        self,
        status_data: ComplaintStatusCreate,
    ) -> ComplaintStatus:


        existing_name = (
            self.repository.get_by_name(
                status_data.name
            )
        )


        if existing_name:
            raise ComplaintStatusAlreadyExistsException()



        existing_sequence = (
            self.repository.get_by_sequence(
                status_data.sequence
            )
        )


        if existing_sequence:
            raise ComplaintStatusSequenceExistsException()



        return self.repository.create(
            status_data
        )



    def get_status(
        self,
        status_id: int,
    ) -> ComplaintStatus:


        status = (
            self.repository.get_by_id(
                status_id
            )
        )


        if status is None:

            raise ComplaintStatusNotFoundException()


        return status



    def get_statuses(
        self,
    ) -> list[ComplaintStatus]:


        return self.repository.get_all()



    def update_status(
        self,
        status_id: int,
        status_data: ComplaintStatusUpdate,
    ) -> ComplaintStatus:


        status = self.get_status(
            status_id
        )



        if (
            status_data.name
            and status_data.name != status.name
        ):

            existing = (
                self.repository.get_by_name(
                    status_data.name
                )
            )


            if existing:
                raise ComplaintStatusAlreadyExistsException()



        if (
            status_data.sequence
            and status_data.sequence != status.sequence
        ):

            existing = (
                self.repository.get_by_sequence(
                    status_data.sequence
                )
            )


            if existing:
                raise ComplaintStatusSequenceExistsException()



        return self.repository.update(
            status,
            status_data,
        )



    def activate_status(
        self,
        status_id: int,
    ) -> ComplaintStatus:


        status = self.get_status(
            status_id
        )


        return self.repository.activate(
            status
        )



    def deactivate_status(
        self,
        status_id: int,
    ) -> ComplaintStatus:


        status = self.get_status(
            status_id
        )


        return self.repository.deactivate(
            status
        )