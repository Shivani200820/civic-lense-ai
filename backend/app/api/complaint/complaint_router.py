from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    status,
    Query,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintResponse,
    CitizenConfirmationRequest,
)
from app.schemas.complaint import ComplaintUpdate
from app.schemas.complaint import ComplaintSupportResponse
from app.services.complaint.complaint_service import ComplaintService
from app.repositories.complaint.complaint_history_repository import (
    ComplaintHistoryRepository,
)
from app.schemas.common import ApiResponse
from app.utils.response import success_response
from app.schemas.complaint_history import ComplaintHistoryResponse

router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"],
)

@router.post(
    "",
    summary="Create Complaint",
    description="Creates a new civic complaint for the authenticated citizen.",
    response_model=ApiResponse[ComplaintResponse],
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Complaint created successfully"},
        400: {"description": "Invalid complaint data"},
        401: {"description": "Unauthorized"},
        422: {"description": "Validation error"},
    },
)
def create_complaint(
    complaint: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintService(db)

    complaint_data = service.create_complaint(
        data=complaint,
        citizen_id=current_user.id,
    )

    return success_response(
        message="Complaint created successfully.",
        data=complaint_data,
    )

@router.get(
    "/me",
    summary="Get My Complaints",
    description="Returns all complaints created by the currently authenticated citizen.",
    response_model=ApiResponse[list[ComplaintResponse]],
    responses={
        200: {"description": "Complaints fetched successfully"},
        401: {"description": "Unauthorized"},
    },
)
def my_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintService(db)

    complaints = service.citizen_complaints(
        current_user.id,
        language=current_user.language,

    )

    return success_response(
        message="Complaints fetched successfully.",
        data=complaints,
    )

@router.get(
    "/number/{complaint_number}",
    summary="Get Complaint by Number",
    description="Returns complaint details using the complaint number.",
    response_model=ApiResponse[ComplaintResponse],
    responses={
        200: {"description": "Complaint fetched successfully"},
        404: {"description": "Complaint not found"},
    },
)
def get_complaint_by_number(
    complaint_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintService(db)

    complaint = service.get_by_number(
        complaint_number,
        current_user.language,

    )

    return success_response(
        message="Complaint fetched successfully.",
        data=complaint,
    )

@router.get(
    "/{complaint_id}",
    summary="Get Complaint by ID",
    description="Returns complaint details using the complaint ID.",
    response_model=ApiResponse[ComplaintResponse],
    responses={
        200: {"description": "Complaint fetched successfully"},
        404: {"description": "Complaint not found"},
    },
)
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintService(db)

    complaint = service.get_complaint(
        complaint_id,
        current_user.language,
    )

    return success_response(
        message="Complaint fetched successfully.",
        data=complaint,
    )



@router.get(
    "",
    summary="List Complaints",
    description="Returns a paginated list of complaints.",
    response_model=ApiResponse[list[ComplaintResponse]],
    responses={
        200: {"description": "Complaints fetched successfully"},
    },
)
def list_complaints(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintService(db)

    complaints = service.list_complaints(
        page=page,
        page_size=page_size,
        language=current_user.language,
    )

    return success_response(
        message="Complaints fetched successfully.",
        data=complaints,
    )

@router.patch(
    "/{complaint_id}",
    summary="Update Complaint",
    description="Allows a citizen to update their complaint before processing.",
    response_model=ApiResponse[ComplaintResponse],
    responses={
        200: {"description": "Complaint updated successfully"},
        403: {"description": "Not allowed to update this complaint"},
        404: {"description": "Complaint not found"},
    },
)
def update_complaint(
    complaint_id: int,
    complaint: ComplaintUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintService(db)

    complaint = service.update_complaint(
        complaint_id=complaint_id,
        data=complaint,
        citizen_id=current_user.id,
    )

    return success_response(
        message="Complaint updated successfully.",
        data=complaint,
    )

@router.delete(
    "/{complaint_id}",
    summary="Delete Complaint",
    description="Deletes a complaint if permitted.",
    response_model=ApiResponse[None],
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Complaint deleted successfully"},
        404: {"description": "Complaint not found"},
    },
)
def delete_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintService(db)

    service.delete_complaint(
        complaint_id,
        current_user.id,
    )

    return success_response(
        message="Complaint deleted successfully."
    )

@router.post(
    "/{complaint_id}/support",
    summary="Support Complaint",
    description="Allows a citizen to support an existing complaint.",
    response_model=ApiResponse[ComplaintSupportResponse],
    responses={
        200: {"description": "Complaint supported successfully"},
        404: {"description": "Complaint not found"},
    },
)
def support_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintService(db)

    support = service.support_complaint(
        complaint_id=complaint_id,
        citizen_id=current_user.id,
    )

    return success_response(
        message="Complaint supported successfully.",
        data=support,
    )

@router.patch(
    "/{complaint_id}/confirm",
    summary="Citizen Confirmation",
    description="Allows the citizen to confirm or reject the complaint resolution.",
    response_model=ApiResponse[ComplaintResponse],
    responses={
        200: {"description": "Citizen confirmation updated successfully"},
        404: {"description": "Complaint not found"},
    },
)
def citizen_confirmation(
    complaint_id: int,
    request: CitizenConfirmationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintService(db)

    complaint = service.citizen_confirmation(
        complaint_id=complaint_id,
        citizen=current_user,
        request=request,
        
    )

    return success_response(
        message="Citizen confirmation updated successfully.",
        data=complaint,
    )

@router.get(
    "/{complaint_id}/timeline",
    summary="Complaint Timeline",
    description="Returns the complete history of a complaint.",
    response_model=ApiResponse[list[ComplaintHistoryResponse]],
)
def complaint_timeline(
    complaint_id: int,
    db: Session = Depends(get_db),
):
    history_repo = ComplaintHistoryRepository(db)

    history = history_repo.get_history(
        complaint_id
    )

    return {
        "success": True,
        "message": "Complaint timeline fetched successfully.",
        "data": [
            ComplaintHistoryResponse.model_validate(
                item,
                from_attributes=True
            )
            for item in history
        ]
    }