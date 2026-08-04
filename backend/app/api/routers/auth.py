from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.jwt import create_access_token
from fastapi.security import OAuth2PasswordRequestForm



from app.database.session import get_db

from app.schemas import user
from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserRegisterResponse,
)
from app.schemas.auth import LoginResponse

from app.services.auth_service import (
    AuthService
)
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.schemas.auth import (
    LoginResponse,
    ChangePasswordRequest,
)
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
limiter = Limiter(
    key_func=get_remote_address
)


@router.post(
    "/register",
    summary="Register a new user",
    description="Creates a new user account in CivicAI.",
    response_model=UserRegisterResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "User registered successfully"},
        400: {"description": "Bad Request"},
        422: {"description": "Validation Error"},
    },
)
@limiter.limit("3/minute")
def register(
    request: Request,
    user_data: UserCreate,
    db: Session = Depends(get_db),
):

    auth_service = AuthService(db)

    user = auth_service.register_user(user_data)

    return UserRegisterResponse(
        success=True,
        message="User registered successfully",
        data=UserResponse.model_validate(user),
        errors=None
    )


@router.post(
    "/login",
    summary="User Login",
    description="Authenticates the user and returns a JWT access token.",
    response_model=LoginResponse,
    responses={
        200: {"description": "Login successful"},
        401: {"description": "Invalid credentials"},
        422: {"description": "Validation Error"},
        429: {"description": "Too many requests"},
    },
)
@limiter.limit("60/minute")
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)

    user = auth_service.authenticate_user(
        form_data.username,
        form_data.password
    )

    token = auth_service.create_user_token(user)

    return LoginResponse(
        access_token=token,
        token_type="bearer",
    )

@router.patch(
    "/change-password",
    summary="Change Password",
)
def change_password(
    request: Request,
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    auth_service = AuthService(db)

    auth_service.change_password(
        current_user=current_user,
        current_password=password_data.current_password,
        new_password=password_data.new_password,
        confirm_password=password_data.confirm_password,
    )

    return {
        "success": True,
        "message": "Password changed successfully.",
        "errors": None,
    }