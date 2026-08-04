from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    String,
    JSON,
)

from datetime import datetime

from app.database.base import Base


class OfflineComplaint(Base):
    __tablename__ = "offline_complaints"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    citizen_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    payload = Column(
        JSON,
        nullable=False,
    )

    status = Column(
        String(20),
        default="PENDING",
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )