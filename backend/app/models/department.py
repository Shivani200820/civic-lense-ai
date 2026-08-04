from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.base_model import BaseModel
from app.shared.mixins import TimestampMixin


class Department(Base, BaseModel, TimestampMixin):
    """
    Department master table.
    Example:
    - Sanitation
    - Water Supply
    - Electricity
    """

    __tablename__ = "departments"

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    complaints = relationship(
        "Complaint",
        back_populates="department",
        foreign_keys="Complaint.department_id",
    )

    officers = relationship(
    "User",
    back_populates="department",
    )