from sqlalchemy.orm import Session

from app.repositories.department_repository import DepartmentRepository
from app.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
)
from app.models.department import Department
from app.core.exceptions import (
    DepartmentAlreadyExistsException,
    DepartmentNotFoundException,
)


class DepartmentService:
    """
    Business logic for Department module.
    """

    def __init__(self, db: Session):
        self.repository = DepartmentRepository(db)

    def create_department(
        self,
        department_data: DepartmentCreate,
    ) -> Department:

        existing_department = self.repository.get_by_name(
            department_data.name
        )

        if existing_department:
            raise DepartmentAlreadyExistsException()

        return self.repository.create(department_data)

    def get_department(
        self,
        department_id: int,
    ) -> Department:

        department = self.repository.get_by_id(department_id)

        if not department:
            raise DepartmentNotFoundException()

        return department

    def get_departments(self) -> list[Department]:

        return self.repository.get_all()

    def update_department(
        self,
        department_id: int,
        department_data: DepartmentUpdate,
    ) -> Department:

        department = self.get_department(department_id)

        if (
            department_data.name
            and department_data.name != department.name
        ):

            existing_department = self.repository.get_by_name(
                department_data.name
            )

            if existing_department:
                raise DepartmentAlreadyExistsException()

        return self.repository.update(
            department,
            department_data,
        )

    def activate_department(
        self,
        department_id: int,
    ) -> Department:

        department = self.get_department(department_id)

        return self.repository.activate(department)

    def deactivate_department(
        self,
        department_id: int,
    ) -> Department:

        department = self.get_department(department_id)

        return self.repository.deactivate(department)