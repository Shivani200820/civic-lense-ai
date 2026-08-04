from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.rbac import require_admin
from app.services.dashboard.recent_activity_service import (
    RecentActivityService,
)

from app.schemas.common import ApiResponse
from app.utils.response import success_response

router = APIRouter(
    prefix="/admin",
    tags=["Recent Activities"],
)


@router.get(
    "/dashboard/recent-activities",
    summary="Get Recent Activities",
    description="Returns the latest complaint and user activities displayed on the admin dashboard.",
    response_model=ApiResponse[dict],
    responses={
        200: {"description": "Recent activities fetched successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
    },
)
def recent_activities(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    service = RecentActivityService(db)

    recent_data = service.get_recent_activity()

    return success_response(
        message="Recent activities fetched successfully.",
        data=recent_data,
    )