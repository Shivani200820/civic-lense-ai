from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.complaint.complaint_service import ComplaintService
from app.schemas.complaint.response import ComplaintResponse
from app.models.user import User
from app.dependencies.rbac import require_officer
from app.schemas.complaint.reject import ComplaintRejectRequest
from app.schemas.complaint import ComplaintResolveRequest
from app.schemas.common import ApiResponse
from app.utils.response import success_response
from app.schemas.officer.dashboard import OfficerDashboardResponse

router = APIRouter(
    prefix="/officer/complaints",
    tags=["Officer"],
)


@router.patch(
    "/{complaint_id}/accept",
    summary="Accept Complaint",
    description="Allows an officer to accept a pending complaint.",
    response_model=ApiResponse[ComplaintResponse],
    responses={
        200: {"description": "Complaint accepted successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Officer access required"},
        404: {"description": "Complaint not found"},
    },
)
def accept_complaint(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_officer),
):


    service = ComplaintService(db)

    complaint = service.accept_complaint(
        complaint_id,
        current_user,
    )

    return success_response(
        message="Complaint accepted successfully.",
        data=complaint,
    )    

@router.patch(
    "/{complaint_id}/reject",
    summary="Reject Complaint",
    description="Allows an officer to reject a complaint by providing a reason.",
    response_model=ApiResponse[ComplaintResponse],
    responses={
        200: {"description": "Complaint rejected successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Officer access required"},
        404: {"description": "Complaint not found"},
    },
)
def reject_complaint(
    complaint_id: int,
    request: ComplaintRejectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_officer),
):

    service = ComplaintService(db)

    complaint = service.reject_complaint(
        complaint_id=complaint_id,
        officer=current_user,
        reason=request.reason,
    )

    return success_response(
        message="Complaint rejected successfully.",
        data=complaint,
    )

@router.patch(
    "/{complaint_id}/start-work",
    summary="Start Complaint Work",
    description="Marks the complaint as work in progress.",
    response_model=ApiResponse[ComplaintResponse],
    responses={
        200: {"description": "Work started successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Officer access required"},
        404: {"description": "Complaint not found"},
    },
)
def start_work(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_officer),
):
    service = ComplaintService(db)

    complaint = service.start_work(
        complaint_id,
        current_user,
    )

    return success_response(
        message="Work started successfully.",
        data=complaint,
    )

@router.patch(
    "/{complaint_id}/resolve",
    summary="Resolve Complaint",
    description="Marks the complaint as resolved with resolution details.",
    response_model=ApiResponse[ComplaintResponse],
    responses={
        200: {"description": "Complaint resolved successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Officer access required"},
        404: {"description": "Complaint not found"},
    },
)
def resolve_complaint(
    complaint_id: int,
    request: ComplaintResolveRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_officer),
):
    service = ComplaintService(db)

    complaint = service.resolve_complaint(
        complaint_id=complaint_id,
        officer=current_user,
        request=request,
    )

    return success_response(
        message="Complaint resolved successfully.",
        data=complaint,
    )


@router.patch(
    "/{complaint_id}/restart-work",
    summary="Restart Complaint Work",
    description="Restarts work on a reopened complaint.",
    response_model=ApiResponse[ComplaintResponse],
    responses={
        200: {"description": "Work restarted successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Officer access required"},
        404: {"description": "Complaint not found"},
    },
)
def restart_work(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_officer),
):

    service = ComplaintService(db)

    complaint = service.restart_work(
        complaint_id=complaint_id,
        officer=current_user,
    )

    return success_response(
        message="Work restarted successfully.",
        data=complaint,
    )
@router.get(
    "",
    summary="Department Complaints",
    response_model=ApiResponse[list[ComplaintResponse]],
)
def department_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_officer),
):
    service = ComplaintService(db)

    complaints = service.officer_department_complaints(
        current_user
    )

    return success_response(
        message="Department complaints fetched successfully.",
        data=complaints,
    )

@router.get(
    "/dashboard",
    summary="Officer Dashboard",
    description="Returns dashboard statistics for the logged-in officer.",
    response_model=ApiResponse[OfficerDashboardResponse],
)
def officer_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_officer),
):
    service = ComplaintService(db)

    dashboard = service.officer_dashboard(
        current_user
    )

    return success_response(
        message="Dashboard fetched successfully.",
        data=dashboard,
    )