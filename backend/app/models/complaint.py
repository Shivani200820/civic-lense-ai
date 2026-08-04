from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    Text,
    Float,
    ForeignKey,
    Boolean,
)



from datetime import datetime
from sqlalchemy.orm import relationship

from app.database.base import Base
from app.shared.mixins import TimestampMixin


class Complaint(Base, TimestampMixin):
    __tablename__ = "complaints"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    complaint_number = Column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    citizen_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=False,
        index=True,
    )

    category_id = Column(
        Integer,
        ForeignKey("complaint_categories.id"),
        nullable=False,
        index=True,
    )

    priority_id = Column(
        Integer,
        ForeignKey("complaint_priorities.id"),
        nullable=False,
        index=True,
    )

    status_id = Column(
        Integer,
        ForeignKey("complaint_statuses.id"),
        nullable=False,
        index=True,
    )

    assigned_officer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
        index=True,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    latitude = Column(
        Float,
        nullable=False,
    )

    longitude = Column(
        Float,
        nullable=False,
    )

    voice_note_url = Column(
        String(500),
        nullable=True,
    )

    image_url = Column(
        String(500),
        nullable=True,
    )

    rejection_reason = Column(
        Text,
        nullable=True,
    )
    
    started_at = Column(
        DateTime,
        nullable=True,
    )

    resolution_remarks = Column(
    Text,
    nullable=True,
    )

    resolution_image_url = Column(
        String(500),
        nullable=True,
    )

    resolved_at = Column(
        DateTime,
        nullable=True,
    )

    citizen_feedback = Column(
    Text,
    nullable=True,
    )

    citizen_rating = Column(
        Integer,
        nullable=True,
    )

    closed_at = Column(
        DateTime,
        nullable=True,
    )

    resolution_duration_hours = Column(
    Float,
    nullable=True,
    
    )

    is_locked = Column(
        Boolean,
        default=False,
        
    )

    # =========================
    # AI Generated Values
    # =========================

    ai_category_id = Column(
        Integer,
        ForeignKey("complaint_categories.id"),
        nullable=True,
    )

    ai_department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=True,
    )

    ai_priority_id = Column(
        Integer,
        ForeignKey("complaint_priorities.id"),
        nullable=True,
    )

    ai_description = Column(
        Text,
        nullable=True,
    )

    ai_confidence = Column(
        Float,
        nullable=True,
    )

    # =========================
    # Final User Approved Values
    # =========================

    final_category_id = Column(
        Integer,
        ForeignKey("complaint_categories.id"),
        nullable=True,
    )

    final_department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=True,
    )

    final_priority_id = Column(
        Integer,
        ForeignKey("complaint_priorities.id"),
        nullable=True,
    )

    final_description = Column(
        Text,
        nullable=True,
    )

    # =========================
    # Relationships
    # =========================

    citizen = relationship(
        "User",
        foreign_keys=[citizen_id],
        back_populates="complaints",
    )

    assigned_officer = relationship(
        "User",
        foreign_keys=[assigned_officer_id],
        back_populates="assigned_complaints",
    )  

    department = relationship(
        "Department",
        foreign_keys=[department_id],
        back_populates="complaints",
    )

    category = relationship(
        "ComplaintCategory",
        foreign_keys=[category_id],
        back_populates="complaints",
    )

    priority = relationship(
        "ComplaintPriority",
        foreign_keys=[priority_id],
        back_populates="complaints",
    )

    status = relationship(
        "ComplaintStatus",
        back_populates="complaints",
    )

    images = relationship(
        "ComplaintImage",
        back_populates="complaint",
        cascade="all, delete-orphan",
    )

    history = relationship(
        "ComplaintHistory",
        back_populates="complaint",
        cascade="all, delete-orphan",
    )

    supports = relationship(
        "ComplaintSupport",
        back_populates="complaint",
        cascade="all, delete-orphan",
    )

    remarks = relationship(
        "OfficerRemark",
        back_populates="complaint",
        cascade="all, delete-orphan",
    )

