from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Text,
    Boolean,
)

from sqlalchemy.orm import relationship

from app.database.base import Base
from app.shared.mixins import TimestampMixin

class OfficerRemark(
    Base,
    TimestampMixin,
):
    __tablename__ = "officer_remarks"

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

    officer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    remark = Column(
        Text,
        nullable=False,
    )

    is_public = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    complaint = relationship(
        "Complaint",
        back_populates="remarks",
    )

    officer = relationship(
        "User",
    )