from sqlalchemy.orm import Session

from app.models.department import Department
from app.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
)


class DepartmentRepository:
    """
    Handles all database operations related to departments.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(
        self,
        department_id: int
    ) -> Department | None:

        return (
            self.db.query(Department)
            .filter(Department.id == department_id)
            .first()
        )

    def get_by_name(
        self,
        name: str
    ) -> Department | None:

        return (
            self.db.query(Department)
            .filter(Department.name == name)
            .first()
        )

    def get_all(self) -> list[Department]:

        return (
            self.db.query(Department)
            .order_by(Department.name.asc())
            .all()
        )

    def create(
        self,
        department_data: DepartmentCreate
    ) -> Department:

        department = Department(
            name=department_data.name,
            description=department_data.description,
        )

        self.db.add(department)
        self.db.commit()
        self.db.refresh(department)

        return department

    def update(
        self,
        department: Department,
        department_data: DepartmentUpdate
    ) -> Department:

        update_data = department_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(department, key, value)

        self.db.commit()
        self.db.refresh(department)

        return department

    def activate(
        self,
        department: Department
    ) -> Department:

        department.is_active = True

        self.db.commit()
        self.db.refresh(department)

        return department

    def deactivate(
        self,
        department: Department
    ) -> Department:

        department.is_active = False

        self.db.commit()
        self.db.refresh(department)

        return department

    def delete(
        self,
        department: Department
    ) -> None:
        """
        Permanent delete.
        Avoid using in production.
        Prefer deactivate().
        """

        self.db.delete(department)
        self.db.commit()