from sqlalchemy.orm import Session

from app.core.exceptions import (
    ComplaintPriorityAlreadyExistsException,
    ComplaintPriorityLevelAlreadyExistsException,
    ComplaintPriorityNotFoundException,
)
from app.models.complaint_priority import ComplaintPriority
from app.repositories.complaint_priority_repository import (
    ComplaintPriorityRepository,
)
from app.schemas.complaint_priority import (
    ComplaintPriorityCreate,
    ComplaintPriorityUpdate,
)


class ComplaintPriorityService:
    """
    Business logic for complaint priorities.
    """

    def __init__(self, db: Session):
        self.repository = ComplaintPriorityRepository(db)

    def create_priority(
        self,
        priority_data: ComplaintPriorityCreate,
    ) -> ComplaintPriority:

        existing_name = self.repository.get_by_name(
            priority_data.name
        )

        if existing_name:
            raise ComplaintPriorityAlreadyExistsException()

        existing_level = self.repository.get_by_level(
            priority_data.level
        )

        if existing_level:
            raise ComplaintPriorityLevelAlreadyExistsException()

        return self.repository.create(priority_data)

    def get_priority(
        self,
        priority_id: int,
    ) -> ComplaintPriority:

        priority = self.repository.get_by_id(priority_id)

        if priority is None:
            raise ComplaintPriorityNotFoundException()

        return priority

    def get_priorities(self) -> list[ComplaintPriority]:

        return self.repository.get_all()

    def update_priority(
        self,
        priority_id: int,
        priority_data: ComplaintPriorityUpdate,
    ) -> ComplaintPriority:

        priority = self.get_priority(priority_id)

        if (
            priority_data.name
            and priority_data.name != priority.name
        ):
            existing = self.repository.get_by_name(
                priority_data.name
            )

            if existing:
                raise ComplaintPriorityAlreadyExistsException()

        if (
            priority_data.level
            and priority_data.level != priority.level
        ):
            existing = self.repository.get_by_level(
                priority_data.level
            )

            if existing:
                raise ComplaintPriorityLevelAlreadyExistsException()

        return self.repository.update(
            priority,
            priority_data,
        )

    def activate_priority(
        self,
        priority_id: int,
    ) -> ComplaintPriority:

        priority = self.get_priority(priority_id)

        return self.repository.activate(priority)

    def deactivate_priority(
        self,
        priority_id: int,
    ) -> ComplaintPriority:

        priority = self.get_priority(priority_id)

        return self.repository.deactivate(priority)