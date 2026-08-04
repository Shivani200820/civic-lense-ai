from sqlalchemy import Boolean, Enum, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.base_model import BaseModel
from app.shared.constants import (
    MAX_EMAIL_LENGTH,
    MAX_NAME_LENGTH,
    MAX_PHONE_LENGTH,
)
from app.shared.enums import UserRole
from app.shared.mixins import TimestampMixin


class User(Base, BaseModel, TimestampMixin):
    __tablename__ = "users"

    full_name: Mapped[str] = mapped_column(
        String(MAX_NAME_LENGTH),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(MAX_EMAIL_LENGTH),
        unique=True,
        nullable=False,
        index=True,
    )

    phone: Mapped[str] = mapped_column(
        String(MAX_PHONE_LENGTH),
        unique=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        nullable=False,
        default=UserRole.CITIZEN,
    )

    language: Mapped[str] = mapped_column(
        String(20),
        default="English",
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id"),
        nullable=True,
    )

    complaints = relationship(
        "Complaint",
        foreign_keys="Complaint.citizen_id",
        back_populates="citizen",
    )

    assigned_complaints = relationship(
        "Complaint",
        foreign_keys="Complaint.assigned_officer_id",
        back_populates="assigned_officer",
    )

    department = relationship(
        "Department",
        back_populates="officers",
    )

    notifications = relationship(
    "Notification",
    back_populates="user",
    cascade="all, delete-orphan",
)




