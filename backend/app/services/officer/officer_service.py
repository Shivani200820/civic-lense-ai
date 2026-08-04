from sqlalchemy.orm import Session

from app.core.password import hash_password
from app.core.exceptions import UserAlreadyExistsException
from app.repositories.user_repository import UserRepository
from app.schemas.officer.create_officer import OfficerCreate
from app.core.exceptions import UserNotFoundException
from app.schemas.officer.update_officer import OfficerUpdate
from app.repositories.complaint.complaint_repository import ComplaintRepository
from app.core.exceptions import PermissionDeniedException

class OfficerService:

    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)
        self.complaint_repository = ComplaintRepository(db)

    def create_officer(
        self,
        officer_data: OfficerCreate,
    ):

        existing_user = self.user_repository.get_by_email(
            officer_data.email
        )

        if existing_user:
            raise UserAlreadyExistsException(
                message="Email already registered",
                status_code=409,
            )

        existing_phone = self.user_repository.get_by_phone(
            officer_data.phone
        )

        if existing_phone:
            raise UserAlreadyExistsException(
                message="Phone already registered",
                status_code=409,
            )

        password_hash = hash_password(
            officer_data.password
        )

        return self.user_repository.create_officer(
            officer_data=officer_data,
            password_hash=password_hash,
        )
    
    def list_officers(self):

        return self.user_repository.get_all_officers()
    
    def get_officer(
        self,
        officer_id: int,
    ):

        officer = self.user_repository.get_officer_by_id(
            officer_id
        )

        if not officer:
            raise UserNotFoundException(
                "Officer not found."
            )

        return officer
    

    def update_officer(
        self,
        officer_id: int,
        officer_data: OfficerUpdate,
    ):

        officer = self.user_repository.get_officer_by_id(
            officer_id
        )

        if not officer:
            raise UserNotFoundException(
                "Officer not found."
            )

        return self.user_repository.update_officer(
            officer,
            officer_data,
        )
    
    def change_officer_status(
        self,
        officer_id: int,
        is_active: bool,
    ):

        officer = self.user_repository.get_officer_by_id(
            officer_id
        )

        if not officer:
            raise UserNotFoundException(
                "Officer not found."
            )

        if is_active:
            return self.user_repository.activate(
                officer
            )

        return self.user_repository.deactivate(
            officer
        )
    
    def get_department_complaints(
        self,
        current_officer,
    ):

        if current_officer.department_id is None:
            raise PermissionDeniedException(
                "Officer is not assigned to any department."
            )

        return self.complaint_repository.get_by_department(
            current_officer.department_id
        )