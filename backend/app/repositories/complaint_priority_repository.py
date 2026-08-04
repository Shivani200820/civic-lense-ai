from sqlalchemy.orm import Session

from app.models.complaint_priority import ComplaintPriority
from app.schemas.complaint_priority import (
    ComplaintPriorityCreate,
    ComplaintPriorityUpdate,
)


class ComplaintPriorityRepository:
    """
    Handles all database operations
    related to complaint priorities.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(
        self,
        priority_id: int,
    ) -> ComplaintPriority | None:

        return (
            self.db.query(ComplaintPriority)
            .filter(ComplaintPriority.id == priority_id)
            .first()
        )

    def get_by_name(
        self,
        name: str,
    ) -> ComplaintPriority | None:

        return (
            self.db.query(ComplaintPriority)
            .filter(ComplaintPriority.name == name)
            .first()
        )

    def get_by_level(
        self,
        level: int,
    ) -> ComplaintPriority | None:

        return (
            self.db.query(ComplaintPriority)
            .filter(ComplaintPriority.level == level)
            .first()
        )

    def get_all(self) -> list[ComplaintPriority]:

        return (
            self.db.query(ComplaintPriority)
            .order_by(ComplaintPriority.level.desc())
            .all()
        )

    def create(
        self,
        priority_data: ComplaintPriorityCreate,
    ) -> ComplaintPriority:

        priority = ComplaintPriority(
            name=priority_data.name,
            description=priority_data.description,
            level=priority_data.level,
            color=priority_data.color,
        )

        self.db.add(priority)
        self.db.commit()
        self.db.refresh(priority)

        return priority

    def update(
        self,
        priority: ComplaintPriority,
        priority_data: ComplaintPriorityUpdate,
    ) -> ComplaintPriority:

        update_data = priority_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(priority, key, value)

        self.db.commit()
        self.db.refresh(priority)

        return priority

    def activate(
        self,
        priority: ComplaintPriority,
    ) -> ComplaintPriority:

        priority.is_active = True

        self.db.commit()
        self.db.refresh(priority)

        return priority

    def deactivate(
        self,
        priority: ComplaintPriority,
    ) -> ComplaintPriority:

        priority.is_active = False

        self.db.commit()
        self.db.refresh(priority)

        return priority

    def delete(
        self,
        priority: ComplaintPriority,
    ) -> None:
        """
        Permanent delete.
        Avoid in production.
        """

        self.db.delete(priority)
        self.db.commit()