from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.rbac import require_admin
from app.services.officer.officer_service import OfficerService
from app.schemas.officer.create_officer import OfficerCreate
from app.schemas.user import UserResponse
from app.schemas.common import ApiResponse
from app.utils.response import success_response
from app.schemas.officer.update_officer import OfficerUpdate
from app.schemas.officer.officer_status import (
    OfficerStatusUpdate,
)

router = APIRouter(
    prefix="/admin/officers",
    tags=["Officer Management"],
)

@router.post(
    "",
    response_model=ApiResponse[UserResponse],
)
def create_officer(
    officer_data: OfficerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    service = OfficerService(db)

    officer = service.create_officer(
        officer_data
    )

    return success_response(
        message="Officer created successfully.",
        data=officer,
    )


@router.get(
    "",
    response_model=ApiResponse[list[UserResponse]],
)
def list_officers(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    service = OfficerService(db)

    officers = service.list_officers()

    return success_response(
        message="Officers fetched successfully.",
        data=officers,
    )

@router.get(
    "/{officer_id}",
    response_model=ApiResponse[UserResponse],
)
def get_officer(
    officer_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    service = OfficerService(db)

    officer = service.get_officer(
        officer_id
    )

    return success_response(
        message="Officer fetched successfully.",
        data=officer,
    )

@router.put(
    "/{officer_id}",
    response_model=ApiResponse[UserResponse],
)
def update_officer(
    officer_id: int,
    officer_data: OfficerUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    service = OfficerService(db)

    officer = service.update_officer(
        officer_id,
        officer_data,
    )

    return success_response(
        message="Officer updated successfully.",
        data=officer,
    )

@router.patch(
    "/{officer_id}/status",
    response_model=ApiResponse[UserResponse],
)
def change_officer_status(
    officer_id: int,
    status: OfficerStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    service = OfficerService(db)

    officer = service.change_officer_status(
        officer_id,
        status.is_active,
    )

    return success_response(
        message="Officer status updated successfully.",
        data=officer,
    )