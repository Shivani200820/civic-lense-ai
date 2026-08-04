from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.shared.enums import UserRole
from app.schemas.officer.create_officer import OfficerCreate


class UserRepository:
    """
    Handles all database operations related to User.
    """

    def __init__(self, db: Session):
        self.db = db


    def get_by_id(
        self,
        user_id: int
    ) -> User | None:

        return (
            self.db
            .query(User)
            .filter(User.id == user_id)
            .first()
        )


    def get_by_email(
        self,
        email: str
    ) -> User | None:

        return (
            self.db
            .query(User)
            .filter(User.email == email)
            .first()
        )


    def get_by_phone(
        self,
        phone: str
    ) -> User | None:

        return (
            self.db
            .query(User)
            .filter(User.phone == phone)
            .first()
        )


    def create(
        self,
        user_data: UserCreate,
        password_hash: str
    ) -> User:

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            phone=user_data.phone,
            password_hash=password_hash,
            language=user_data.language
        )


        self.db.add(user)

        self.db.commit()

        self.db.refresh(user)

        return user
    
    def create_officer(
        self,
        officer_data: OfficerCreate,
        password_hash: str,
    ) -> User:

        user = User(
            full_name=officer_data.full_name,
            email=officer_data.email,
            phone=officer_data.phone,
            password_hash=password_hash,
            role=UserRole.OFFICER,
            department_id=officer_data.department_id,
            language=officer_data.language,
            is_active=True,
        )

        self.db.add(user)

        self.db.commit()

        self.db.refresh(user)

        return user
    
    def get_all_officers(self) -> list[User]:

        return (
            self.db
            .query(User)
            .filter(User.role == UserRole.OFFICER)
            .all()
        )
    
    def get_officers_by_department(
        self,
        department_id: int,
    ):

        return (
            self.db.query(User)
            .filter(
                User.role == UserRole.OFFICER,
                User.department_id == department_id,
                User.is_active == True,
            )
            .all()
        )
    
    def get_officer_by_id(
        self,
        officer_id: int,
    ) -> User | None:

        return (
            self.db
            .query(User)
            .filter(
                User.id == officer_id,
                User.role == UserRole.OFFICER,
            )
            .first()
        )

    def update_officer(
        self,
        officer: User,
        officer_data,
    ) -> User:

        update_data = officer_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(
                officer,
                key,
                value,
            )

        self.db.commit()

        self.db.refresh(officer)

        return officer


    def update(
        self,
        user: User,
        user_data: UserUpdate
    ) -> User:


        update_data = user_data.model_dump(
            exclude_unset=True
        )


        for key, value in update_data.items():

            setattr(
                user,
                key,
                value
            )


        self.db.commit()

        self.db.refresh(user)

        return user



    def activate(
        self,
        user: User
    ) -> User:


        user.is_active = True

        self.db.commit()

        self.db.refresh(user)

        return user



    def deactivate(
        self,
        user: User
    ) -> User:


        user.is_active = False

        self.db.commit()

        self.db.refresh(user)

        return user
    

    def update_password(
        self,
        user,
        new_password_hash: str,
    ):
        user.password_hash = new_password_hash

        self.db.commit()
        self.db.refresh(user)

        return user