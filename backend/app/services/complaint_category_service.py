from sqlalchemy.orm import Session

from app.core.exceptions import (
    ComplaintCategoryAlreadyExistsException,
    ComplaintCategoryNotFoundException,
)
from app.models.complaint_category import ComplaintCategory
from app.repositories.complaint_category_repository import (
    ComplaintCategoryRepository,
)
from app.schemas.complaint_category import (
    ComplaintCategoryCreate,
    ComplaintCategoryUpdate,
)


class ComplaintCategoryService:
    """
    Business logic for complaint categories.
    """

    def __init__(self, db: Session):
        self.repository = ComplaintCategoryRepository(db)

    def create_category(
        self,
        category_data: ComplaintCategoryCreate,
    ) -> ComplaintCategory:

        existing = self.repository.get_by_name(
            category_data.name
        )

        if existing:
            raise ComplaintCategoryAlreadyExistsException()

        return self.repository.create(category_data)

    def get_category(
        self,
        category_id: int,
    ) -> ComplaintCategory:

        category = self.repository.get_by_id(category_id)

        if category is None:
            raise ComplaintCategoryNotFoundException()

        return category

    def get_categories(self) -> list[ComplaintCategory]:

        return self.repository.get_all()

    def update_category(
        self,
        category_id: int,
        category_data: ComplaintCategoryUpdate,
    ) -> ComplaintCategory:

        category = self.get_category(category_id)

        if (
            category_data.name
            and category_data.name != category.name
        ):

            existing = self.repository.get_by_name(
                category_data.name
            )

            if existing:
                raise ComplaintCategoryAlreadyExistsException()

        return self.repository.update(
            category,
            category_data,
        )

    def activate_category(
        self,
        category_id: int,
    ) -> ComplaintCategory:

        category = self.get_category(category_id)

        return self.repository.activate(category)

    def deactivate_category(
        self,
        category_id: int,
    ) -> ComplaintCategory:

        category = self.get_category(category_id)

        return self.repository.deactivate(category)