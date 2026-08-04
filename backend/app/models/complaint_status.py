from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.base_model import BaseModel
from app.shared.mixins import TimestampMixin


class ComplaintStatus(
    Base,
    BaseModel,
    TimestampMixin
):
    """
    Master table for complaint statuses.

    Examples:
    Pending
    Accepted
    In Progress
    Resolved
    Closed
    Reopened
    """

    __tablename__ = "complaint_statuses"


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


    sequence: Mapped[int] = mapped_column(
        Integer,
        unique=True,
        nullable=False,
    )


    is_final: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )


    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    complaints = relationship(
    "Complaint",
    back_populates="status",
)