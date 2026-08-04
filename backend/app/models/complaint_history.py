from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Text,
)

from sqlalchemy.orm import relationship

from app.database.base import Base
from app.shared.mixins import TimestampMixin

class ComplaintHistory(
    Base,
    TimestampMixin,
):
    __tablename__ = "complaint_history"

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

    old_status_id = Column(
        Integer,
        ForeignKey("complaint_statuses.id"),
        nullable=False,
    )

    new_status_id = Column(
        Integer,
        ForeignKey("complaint_statuses.id"),
        nullable=False,
    )
    changed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    remarks = Column(
        Text,
        nullable=True,
    )

    complaint = relationship(
        "Complaint",
        back_populates="history",
    )

    old_status = relationship(
        "ComplaintStatus",
        foreign_keys=[old_status_id],
    )

    new_status = relationship(
        "ComplaintStatus",
        foreign_keys=[new_status_id],
    )

    user = relationship(
        "User",
    )