from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.base_model import BaseModel
from app.shared.mixins import TimestampMixin


class ComplaintPriority(Base, BaseModel, TimestampMixin):
    """
    Master table for complaint priorities.

    Examples:
    - Critical
    - High
    - Medium
    - Low
    """

    __tablename__ = "complaint_priorities"

    name: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    level: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        unique=True,
    )

    color: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    complaints = relationship(
        "Complaint",
        back_populates="priority",
        foreign_keys="Complaint.priority_id",
    )