
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.constants.complaint_status import (
    ComplaintStatus,
    is_valid_transition,
)
from app.models.complaint import Complaint
from app.models.user import User

from app.repositories.complaint.complaint_repository import ComplaintRepository
from app.repositories.complaint.complaint_query import (
    ComplaintQueryRepository,
)

from app.repositories.complaint_category_repository import (
    ComplaintCategoryRepository,
)
from app.repositories.department_repository import (
    DepartmentRepository,
)
from app.repositories.complaint_priority_repository import (
    ComplaintPriorityRepository,
)

from app.schemas import complaint
from app.schemas.complaint import ComplaintCreate
from app.schemas.complaint.update import ComplaintUpdate

from app.utils.complaint_number import generate_complaint_number

from app.services.complaint.duplicate_detection_service import (
    DuplicateDetectionService,
)
from app.repositories.complaint.complaint_support_repository import (
    ComplaintSupportRepository,
)
from app.models.complaint_support import ComplaintSupport
from app.repositories.complaint.complaint_history_repository import (
    ComplaintHistoryRepository,
)
from app.models.complaint_history import ComplaintHistory

from datetime import datetime

from app.schemas.complaint import (
    ComplaintResolveRequest,
    CitizenConfirmationRequest,
)
from app.core.logging import logger
from app.repositories.user_repository import UserRepository
from app.services.notification_service import NotificationService
from app.services.translation.translation_service import TranslationService


CATEGORY_MAP = {
    "road": "Pothole",
    "pothole": "Pothole",
    "garbage": "Garbage",
    "water leakage": "Water Leakage",
    "water": "Water Leakage",
    "street light": "Street Light",
    "drain": "Drain Blockage",
    "drain blockage": "Drain Blockage",
    "water supply": "Water Leakage",
}

DEPARTMENT_MAP = {
    "municipal corporation": "Sanitation",
    "public works department": "Roads",
    "roads": "Roads",
    "road": "Roads",
    "sanitation": "Sanitation",
    "water supply": "Water Supply",
    "electricity": "Electricity",
    "drainage": "Drainage",
}

PRIORITY_MAP = {
    "low": "Low",
    "medium": "Medium",
    "high": "High",
    "critical": "Critical",
}

class ComplaintService:

    def __init__(self, db: Session):
        self.db = db

        self.repository = ComplaintRepository(db)
        self.query_repository = ComplaintQueryRepository(db)

        self.category_repository = ComplaintCategoryRepository(db)
        self.department_repository = DepartmentRepository(db)
        self.priority_repository = ComplaintPriorityRepository(db)
        self.support_repository = ComplaintSupportRepository(db)
        self.history_repository = ComplaintHistoryRepository(db)
        self.user_repository = UserRepository(db)
        self.notification_service = NotificationService(db)

    def translate_complaint(
        self,
        complaint,
        language,
    ):

        complaint.title = TranslationService.translate(
            complaint.title,
            language,
        )

        complaint.description = TranslationService.translate(
            complaint.description,
            language,
        )

        complaint.ai_description = TranslationService.translate(
            complaint.ai_description,
            language,
        )

        complaint.resolution_remarks = TranslationService.translate(
            complaint.resolution_remarks,
            language,
        )

        complaint.citizen_feedback = TranslationService.translate(
            complaint.citizen_feedback,
            language,
        )

        return complaint

    def calculate_resolution_duration(
        self,
        complaint,
    ):
        if complaint.started_at and complaint.closed_at:
            delta = complaint.closed_at - complaint.started_at

            return round(
                delta.total_seconds() / 3600,
                2,
            )

        return None

    def create_complaint(
        self,
        data: ComplaintCreate,
        citizen_id: int,
    ) -> Complaint:

        # AI Analysis
        class AIData:
            pass


        parsed = AIData()

        parsed.category = data.ai_category
        parsed.department = data.ai_department
        parsed.priority = data.ai_priority
        parsed.description = data.ai_description
        parsed.confidence = data.ai_confidence
        parsed.title = data.ai_title

        if not parsed.category:
            raise HTTPException(
                status_code=400,
                detail="AI category missing."
            )

        title = data.ai_title or data.title

        if not title or title.strip() == "":
            title = parsed.category

        category_name = CATEGORY_MAP.get(
            parsed.category.strip().lower(),
            parsed.category,
        )

        department_name = DEPARTMENT_MAP.get(
            parsed.department.strip().lower(),
            parsed.department,
        )

        priority_name = PRIORITY_MAP.get(
            parsed.priority.strip().lower(),
            parsed.priority,
        )

        category = self.category_repository.get_by_name(
            category_name
        )

        department = self.department_repository.get_by_name(
            department_name
        )

        priority = self.priority_repository.get_by_name(
            priority_name
        )
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category '{parsed.category}' not found.",
            )

        if department is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Department '{parsed.department}' not found.",
            )

        if priority is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Priority '{parsed.priority}' not found.",
            )

        # Duplicate Detection
        duplicate_service = DuplicateDetectionService(
            self.db
        )

        existing = duplicate_service.find_duplicate(
            latitude=data.latitude,
            longitude=data.longitude,
            category_id=category.id,
        )


        if existing:
            logger.warning(
                f"Duplicate complaint detected for citizen {citizen_id}. Existing complaint ID: {existing.id}"
            )

            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "message": "Similar complaint already exists.",
                    "complaint_id": existing.id,
                    "complaint_number": existing.complaint_number,
                },
            )


        officers = self.user_repository.get_officers_by_department(
            department.id
        )

        assigned_officer = None

        if officers:
            assigned_officer = officers[0]
      

        complaint = Complaint(
            complaint_number=generate_complaint_number(),
            citizen_id=citizen_id,

            assigned_officer_id=(
                assigned_officer.id
                if assigned_officer
                else None
            ),

            title=title,
            description=data.description,

            latitude=data.latitude,
            longitude=data.longitude,

            voice_note_url=data.voice_note_url,

            image_url=data.image_url,

            # Current values
            department_id=department.id,
            category_id=category.id,
            priority_id=priority.id,
            status_id=ComplaintStatus.PENDING,

            # AI values
            ai_category_id=category.id,
            ai_department_id=department.id,
            ai_priority_id=priority.id,
            ai_description=parsed.description,
            ai_confidence=parsed.confidence,
            

            # Final values
            final_category_id=category.id,
            final_department_id=department.id,
            final_priority_id=priority.id,
            final_description=parsed.description,
        )


        created_complaint = self.repository.create(complaint)

        if assigned_officer:
            self.notification_service.create_notification(
                user_id=assigned_officer.id,
                title="New Complaint Assigned",
                message=f"Complaint {created_complaint.complaint_number} has been assigned to you.",
                notification_type="complaint_assigned",
            )

        logger.info(
            f"Complaint {created_complaint.id} created by user {citizen_id}"
        )

        return created_complaint


    def get_complaint(
        self,
        complaint_id: int,
        language: str = "en",
    ):

        complaint = self.repository.get_by_id(
            complaint_id
        )

        if complaint is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Complaint not found.",
            )

        self.translate_complaint(
            complaint,
            language,
        )


        return complaint
    
    def validate_officer_department(
        self,
        complaint: Complaint,
        officer: User,
    ):
        if complaint.department_id != officer.department_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not allowed to access complaints from another department.",
            )

    def get_by_number(
        self,
        complaint_number: str,
        language: str,

    ):

        complaint = self.repository.get_by_number(
            complaint_number
        )

        if complaint is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Complaint not found.",
            )

        self.translate_complaint(
            complaint,
            language,
        )

        return complaint

    def list_complaints(
        self,
        page: int = 1,
        page_size: int = 10,
        language: str = "en",
    ):

        query = self.query_repository.get_query()

        query = self.query_repository.sort(query)

        complaints = self.query_repository.paginate(
            query,
            page,
            page_size,
        )

        for complaint in complaints:
            self.translate_complaint(
                complaint,
                language,
            )

        return complaints

    def complaints_by_status(
        self,
        status_id: int,
        language: str = "en",
    ):

        complaints = (
            self.query_repository
            .filter_by_status(status_id)
            .all()
        )

        for complaint in complaints:
            self.translate_complaint(
                complaint,
                language,
            )

        return complaints

    def complaints_by_department(
        self,
        department_id: int,
        language: str = "en",
    ):

        complaints = (
            self.query_repository
            .filter_by_department(department_id)
            .all()
        )

        for complaint in complaints:
            self.translate_complaint(
                complaint,
                language,
            )

        return complaints

    def citizen_complaints(
        self,
        citizen_id: int,
        language: str,
    ):

        complaints = (
            self.query_repository
            .filter_by_citizen(citizen_id)
            .all()
        )

        for complaint in complaints:
            self.translate_complaint(
                complaint,
                language,
            )

        return complaints
    
    def officer_department_complaints(
        self,
        officer: User,
        language: str = "en",
    ):

        if officer.department_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Officer is not assigned to any department.",
            )

        complaints = (
            self.query_repository
            .filter_by_department(officer.department_id)
            .all()
        )

        for complaint in complaints:
            self.translate_complaint(
                complaint,
                language,
            )

        return complaints
    
    def officer_dashboard(
        self,
        officer: User,
    ):
        if officer.department_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Officer is not assigned to any department.",
            )

        return self.repository.dashboard_counts(
            officer.department_id
        )

    def update_complaint(
        self,
        complaint_id: int,
        data: ComplaintUpdate,
        citizen_id: int,
    ):

        complaint = self.get_complaint(
            complaint_id
        )

        if complaint.is_locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Closed complaints cannot be modified.",
            )        

        if complaint.citizen_id != citizen_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot update this complaint.",
            )

        if complaint.status_id != ComplaintStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Complaint can no longer be updated.",
            )

        update_data = data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(
                complaint,
                key,
                value,
            )

        updated_complaint = self.repository.update(
            complaint
        )

        logger.info(
            f"Complaint {updated_complaint.id} updated by user {citizen_id}"
        )

        return updated_complaint


    def delete_complaint(
        self,
        complaint_id: int,
        citizen_id: int,
    ):

        complaint = self.get_complaint(
            complaint_id
        )

        if complaint.is_locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Closed complaints cannot be modified.",
            )

        if complaint.citizen_id != citizen_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot delete this complaint.",
            )

        if complaint.status_id != ComplaintStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Complaint cannot be deleted after it has been accepted.",
            )

        self.repository.delete(
            complaint
        )

        logger.info(
            f"Complaint {complaint.id} deleted by user {citizen_id}"
        )

        return {
            "message": "Complaint deleted successfully."
        }
    
    def support_complaint(
        self,
        complaint_id: int,
        citizen_id: int,
    ):

        complaint = self.get_complaint(
            complaint_id
        )

        if self.support_repository.exists(
            complaint_id,
            citizen_id,
        ):
            raise HTTPException(
                status_code=409,
                detail="You already support this complaint.",
            )

        support = ComplaintSupport(
            complaint_id=complaint.id,
            citizen_id=citizen_id,
        )

        self.support_repository.create(
            support
        )

        logger.info(
            f"Complaint {complaint.id} supported by citizen {citizen_id}"
        )

        return {
            "message": "Support added successfully.",
            "support_count": self.support_repository.count(
                complaint.id
            ),
        }
    def accept_complaint(
        self,
        complaint_id: int,
        officer: User,
    ):

        complaint = self.get_complaint(
            complaint_id
        )

        print("Complaint ID:", complaint.id)
        print("Current Status:", complaint.status_id)
        print("Current Status Enum:", ComplaintStatus(complaint.status_id))
        print(
            "Can Accept:",
            is_valid_transition(
                ComplaintStatus(complaint.status_id),
                ComplaintStatus.ACCEPTED,
            ),
        )

        self.validate_officer_department(
            complaint,
            officer,
        )

        if complaint.is_locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Closed complaints cannot be modified.",
            )

        if not is_valid_transition(
            ComplaintStatus(complaint.status_id),
            ComplaintStatus.ACCEPTED,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status transition.",
            )

        old_status = ComplaintStatus(
            complaint.status_id
        )

        complaint.assigned_officer_id = officer.id
        complaint.status_id = ComplaintStatus.ACCEPTED

        self.repository.save(
            complaint
        )

        history = ComplaintHistory(
            complaint_id=complaint.id,
            old_status_id=old_status,
            new_status_id=ComplaintStatus.ACCEPTED,
            changed_by=officer.id,
        )

        self.history_repository.create(
            history
        )

        self.notification_service.create_notification(
            user_id=complaint.citizen_id,
            title="Complaint Accepted",
            message=f"Your complaint {complaint.complaint_number} has been accepted by the officer.",
            notification_type="complaint_accepted",
        )

        logger.info(
            f"Complaint {complaint.id} accepted by officer {officer.id}"
        )

        return complaint
    
    def reject_complaint(
        self,
        complaint_id: int,
        officer: User,
        reason: str,
    ):

        complaint = self.get_complaint(
            complaint_id
        )

        self.validate_officer_department(
            complaint,
            officer,
        )

        if complaint.is_locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Closed complaints cannot be modified.",
            )

        if not is_valid_transition(
            ComplaintStatus(complaint.status_id),
            ComplaintStatus.REJECTED,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status transition.",
            )

        old_status = complaint.status_id

        complaint.status_id = ComplaintStatus.REJECTED
        complaint.assigned_officer_id = officer.id
        complaint.rejection_reason = reason

        self.repository.save(
            complaint
        )

        history = ComplaintHistory(
            complaint_id=complaint.id,
            old_status_id=old_status,
            new_status_id=ComplaintStatus.REJECTED,
            changed_by=officer.id,
            remarks=reason,
        )

        self.history_repository.create(
            history
        )

        self.notification_service.create_notification(
            user_id=complaint.citizen_id,
            title="Complaint Rejected",
            message=f"Your complaint {complaint.complaint_number} has been rejected.",
            notification_type="complaint_rejected",
        )

        logger.info(
            f"Complaint {complaint.id} rejected by officer {officer.id}"
        )

        return complaint
    
    def start_work(
        self,
        complaint_id: int,
        officer: User,
    ):
        complaint = self.get_complaint(
            complaint_id
        )

        self.validate_officer_department(
            complaint,
            officer,
        )

        if complaint.is_locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Closed complaints cannot be modified.",
            )

        # Only assigned officer can start work
        if complaint.assigned_officer_id != officer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not assigned to this complaint.",
            )

        # Validate status transition
        if not is_valid_transition(
            ComplaintStatus(complaint.status_id),
            ComplaintStatus.IN_PROGRESS,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status transition.",
            )

        # Don't hardcode old status
        old_status = complaint.status_id

        complaint.status_id = ComplaintStatus.IN_PROGRESS
        complaint.started_at = datetime.utcnow()

        self.repository.save(
            complaint
        )

        history = ComplaintHistory(
            complaint_id=complaint.id,
            old_status_id=old_status,
            new_status_id=ComplaintStatus.IN_PROGRESS,
            changed_by=officer.id,
        )

        self.history_repository.create(
            history
        )

        self.notification_service.create_notification(
            user_id=complaint.citizen_id,
            title="Work Started",
            message=f"Work has started on your complaint {complaint.complaint_number}.",
            notification_type="work_started",
        )

        logger.info(
            f"Officer {officer.id} started work on complaint {complaint.id}"
        )

        return complaint
    

    def restart_work(
        self,
        complaint_id: int,
        officer: User,
    ):
        complaint = self.get_complaint(
            complaint_id
        )

        self.validate_officer_department(
            complaint,
            officer,
        )

        if complaint.is_locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Closed complaints cannot be modified.",
            )

        # Only assigned officer can restart work
        if complaint.assigned_officer_id != officer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not assigned to this complaint.",
            )

        # Validate status transition
        if not is_valid_transition(
            ComplaintStatus(complaint.status_id),
            ComplaintStatus.IN_PROGRESS,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status transition.",
            )

        old_status = complaint.status_id

        complaint.status_id = ComplaintStatus.IN_PROGRESS
        complaint.started_at = datetime.utcnow()

        # Keep previous resolution fields unchanged
        self.repository.save(
            complaint
        )

        history = ComplaintHistory(
            complaint_id=complaint.id,
            old_status_id=old_status,
            new_status_id=ComplaintStatus.IN_PROGRESS,
            changed_by=officer.id,
        )

        self.history_repository.create(
            history
        )

        self.notification_service.create_notification(
            user_id=complaint.citizen_id,
            title="Work Restarted",
            message=f"Work has restarted on your complaint {complaint.complaint_number}.",
            notification_type="work_restarted",
        )

        logger.info(
            f"Officer {officer.id} restarted work on complaint {complaint.id}"
        )

        return complaint
        

    def resolve_complaint(
        self,
        complaint_id: int,
        officer: User,
        request: ComplaintResolveRequest,
    ):
        complaint = self.get_complaint(
            complaint_id
        )
        

        self.validate_officer_department(
            complaint,
            officer,
        )

        if complaint.is_locked:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Closed complaints cannot be modified.",
            )

        if complaint.assigned_officer_id != officer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not assigned to this complaint.",
            )

        if not is_valid_transition(
            ComplaintStatus(complaint.status_id),
            ComplaintStatus.RESOLVED,
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status transition.",
            )

        old_status = complaint.status_id

        complaint.status_id = ComplaintStatus.RESOLVED

        complaint.resolution_remarks = (
            request.resolution_remarks
        )

        complaint.resolution_image_url = (
            request.resolution_image_url
        )

        complaint.resolved_at = datetime.utcnow()

        self.repository.save(
            complaint
        )

        history = ComplaintHistory(
            complaint_id=complaint.id,
            old_status_id=old_status,
            new_status_id=ComplaintStatus.RESOLVED,
            changed_by=officer.id,
            remarks=request.resolution_remarks,
        )

        self.history_repository.create(
            history
        )

        self.notification_service.create_notification(
            user_id=complaint.citizen_id,
            title="Complaint Resolved",
            message=f"Your complaint {complaint.complaint_number} has been resolved.",
            notification_type="complaint_resolved",
        )

        logger.info(
            f"Complaint {complaint.id} resolved by officer {officer.id}"
        )

        return complaint
    
    def citizen_confirmation(
        self,
        complaint_id: int,
        citizen: User,
        request: CitizenConfirmationRequest,
    ):
        complaint = self.get_complaint(
            complaint_id
        )

        # Verify complaint owner
        if complaint.citizen_id != citizen.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only confirm your own complaint.",
            )

        # Only resolved complaints can be confirmed
        if ComplaintStatus(complaint.status_id) != ComplaintStatus.RESOLVED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only resolved complaints can be confirmed.",
            )

        old_status = ComplaintStatus(
            complaint.status_id
        )
                # Save citizen feedback
        complaint.citizen_feedback = request.feedback
        complaint.citizen_rating = request.rating

        if request.decision == "close":
                complaint.status_id = ComplaintStatus.CLOSED

                complaint.closed_at = datetime.utcnow()

                complaint.is_locked = True

                complaint.resolution_duration_hours = (
                    self.calculate_resolution_duration(
                        complaint
                    )
                )

                new_status = ComplaintStatus.CLOSED
        else:
                complaint.status_id = ComplaintStatus.REOPENED

                new_status = ComplaintStatus.REOPENED

        self.repository.save(
            complaint
        )

        history = ComplaintHistory(
            complaint_id=complaint.id,
            old_status_id=old_status,
            new_status_id=new_status,
            changed_by=citizen.id,
            remarks=request.feedback,
        )

        self.history_repository.create(
            history
        )

        if request.decision == "close":

            self.notification_service.create_notification(
                user_id=complaint.assigned_officer_id,
                title="Complaint Closed",
                message=f"Complaint {complaint.complaint_number} has been closed by the citizen.",
                notification_type="complaint_closed",
            )

        else:

            self.notification_service.create_notification(
                user_id=complaint.assigned_officer_id,
                title="Complaint Reopened",
                message=f"Complaint {complaint.complaint_number} has been reopened by the citizen.",
                notification_type="complaint_reopened",
            )

        logger.info(
            f"Citizen {citizen.id} marked complaint {complaint.id} as {new_status.name}"
        )

        return complaint