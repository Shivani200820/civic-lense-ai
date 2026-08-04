from sqlalchemy.orm import Session

from app.models.complaint_category import ComplaintCategory
from app.schemas.complaint_category import (
    ComplaintCategoryCreate,
    ComplaintCategoryUpdate,
)


class ComplaintCategoryRepository:
    """
    Handles all database operations
    related to complaint categories.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(
        self,
        category_id: int,
    ) -> ComplaintCategory | None:

        return (
            self.db.query(ComplaintCategory)
            .filter(
                ComplaintCategory.id == category_id
            )
            .first()
        )

    def get_by_name(
        self,
        name: str,
    ) -> ComplaintCategory | None:

        return (
            self.db.query(ComplaintCategory)
            .filter(
                ComplaintCategory.name == name
            )
            .first()
        )

    def get_all(self) -> list[ComplaintCategory]:

        return (
            self.db.query(ComplaintCategory)
            .order_by(
                ComplaintCategory.name.asc()
            )
            .all()
        )

    def create(
        self,
        category_data: ComplaintCategoryCreate,
    ) -> ComplaintCategory:

        category = ComplaintCategory(
            name=category_data.name,
            description=category_data.description,
        )

        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)

        return category

    def update(
        self,
        category: ComplaintCategory,
        category_data: ComplaintCategoryUpdate,
    ) -> ComplaintCategory:

        update_data = category_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(category, key, value)

        self.db.commit()
        self.db.refresh(category)

        return category

    def activate(
        self,
        category: ComplaintCategory,
    ) -> ComplaintCategory:

        category.is_active = True

        self.db.commit()
        self.db.refresh(category)

        return category

    def deactivate(
        self,
        category: ComplaintCategory,
    ) -> ComplaintCategory:

        category.is_active = False

        self.db.commit()
        self.db.refresh(category)

        return category

    def delete(
        self,
        category: ComplaintCategory,
    ) -> None:
        """
        Permanent delete.
        Avoid in production.
        """

        self.db.delete(category)
        self.db.commit()