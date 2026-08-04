from datetime import timedelta

from sqlalchemy.orm import Session

from app.core.jwt import create_access_token
from app.core.password import (
    hash_password,
    verify_password
)

from app.models.user import User

from app.repositories.user_repository import (
    UserRepository
)

from app.schemas.user import (
    UserCreate
)

from app.shared.enums import UserRole
from app.core.exceptions import InvalidCredentialsException, UserAlreadyExistsException
from app.core.logging import logger


class AuthService:
    """
    Handles authentication business logic.
    """


    def __init__(
        self,
        db: Session
    ):

        self.user_repository = UserRepository(db)



    def register_user(
        self,
        user_data: UserCreate
    ) -> User:

        existing_user = (
            self.user_repository
            .get_by_email(user_data.email)
        )


        if existing_user:
            raise UserAlreadyExistsException(
                message="Email already registered",
                status_code=409
            )


        existing_phone = (
            self.user_repository
            .get_by_phone(user_data.phone)
        )


        if existing_phone:
            raise UserAlreadyExistsException(
                message="Phone already registered",
                status_code=409
            )


        password_hash = hash_password(
            user_data.password
        )


        user = (
            self.user_repository
            .create(
                user_data,
                password_hash
            )
        )

        logger.info(f"User registered: {user.email}")

        return user




    def authenticate_user(
        self,
        email: str,
        password: str
    ) -> User | None:


        user = (
            self.user_repository
            .get_by_email(email)
        )


        if not user:
            logger.warning(f"Failed login attempt: {email}")

            raise InvalidCredentialsException(
                message="Invalid email or password",
                status_code=401
            )


        if not verify_password(
            password,
            user.password_hash
        ):
            logger.warning(f"Failed login attempt: {email}")

            raise InvalidCredentialsException(
                message="Invalid email or password",
                status_code=401
            )

        logger.info(f"User logged in: {user.email}")

        return user




    def create_user_token(
        self,
        user: User
    ):


        token = create_access_token(
            subject=user.id
        )


        return token

    def change_password(
        self,
        current_user: User,
        current_password: str,
        new_password: str,
        confirm_password: str,
    ):

        if not verify_password(
            current_password,
            current_user.password_hash,
        ):
            raise InvalidCredentialsException(
                message="Current password is incorrect.",
                status_code=400,
            )

        if new_password != confirm_password:
            raise ValueError(
                "New password and confirm password do not match."
            )

        if verify_password(
            new_password,
            current_user.password_hash,
        ):
            raise ValueError(
                "New password cannot be same as current password."
            )

        password_hash = hash_password(
            new_password
        )

        return self.user_repository.update_password(
            current_user,
            password_hash,
        )