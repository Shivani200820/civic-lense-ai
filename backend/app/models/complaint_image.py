from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Enum,
    Boolean,
)

from sqlalchemy.orm import relationship

from app.database.base import Base

from app.shared.mixins import TimestampMixin

import enum

class ImageType(str, enum.Enum):
    BEFORE = "BEFORE"
    AFTER = "AFTER"

class ComplaintImage(Base, TimestampMixin):
    __tablename__ = "complaint_images"

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

    image_url = Column(
        String(500),
        nullable=False,
    )

    image_type = Column(
        Enum(ImageType),
        nullable=False,
    )

    complaint = relationship(
        "Complaint",
        back_populates="images",
    )

    local_path = Column(
        String(500),
        nullable=True,
    )

    storage_type = Column(
        String(20),
        nullable=False,
        default="cloudinary",
    )

    is_synced = Column(
        Boolean,
        default=True,
        nullable=False,
    )