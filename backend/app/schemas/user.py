from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.shared.enums import UserRole
from app.shared.constants import (
    MAX_NAME_LENGTH,
    MAX_PHONE_LENGTH
)


# -----------------------------
# Base User Schema
# -----------------------------

class UserBase(BaseModel):

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=MAX_NAME_LENGTH,
        description="Full name of the user",
        examples=["John Doe"],
    )

    email: EmailStr = Field(
        ...,
        description="User email address",
        examples=["john@example.com"],
    )

    phone: str = Field(
        ...,
        min_length=10,
        max_length=MAX_PHONE_LENGTH,
        description="10-digit mobile number",
        examples=["9876543210"],
    )

    language: str = Field(
        default="English",
        description="Preferred language",
        examples=["English"],
    )



# -----------------------------
# Create User Schema
# -----------------------------

class UserCreate(UserBase):

    password: str = Field(
        ...,
        min_length=8,
        description="Password (minimum 8 characters)",
        examples=["Password@123"],
    )



# -----------------------------
# Update User Schema
# -----------------------------

class UserUpdate(BaseModel):

    full_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=MAX_NAME_LENGTH,
        description="Updated full name",
        examples=["Shivani Dahiphale"],
    )

    phone: str | None = Field(
        default=None,
        min_length=10,
        max_length=MAX_PHONE_LENGTH,
        description="Updated mobile number",
        examples=["9876543210"],
    )

    language: str | None = Field(
        default=None,
        description="Updated preferred language",
        examples=["Marathi"],
    )



# -----------------------------
# User Response Schema
# -----------------------------

class UserResponse(UserBase):

    id: int

    role: UserRole

    department_id: int | None = None

    is_active: bool

    created_at: datetime

    updated_at: datetime


    class Config:

        from_attributes = True

class UserRegisterResponse(BaseModel):
    success: bool
    message: str
    data: UserResponse
    errors: str | None = None

