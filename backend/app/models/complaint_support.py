from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    UniqueConstraint,
)

from sqlalchemy.orm import relationship

from app.database.base import Base
from app.shared.mixins import TimestampMixin

class ComplaintSupport(
    Base,
    TimestampMixin,
):
    __tablename__ = "complaint_supports"

    __table_args__ = (
        UniqueConstraint(
            "complaint_id",
            "citizen_id",
            name="uq_complaint_support",
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    complaint_id = Column(
        Integer,
        ForeignKey("complaints.id"),
        nullable=False,
    )

    citizen_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    complaint = relationship(
        "Complaint",
        back_populates="supports",
    )

    citizen = relationship(
        "User",
    )