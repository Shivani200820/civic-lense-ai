from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.rbac import require_admin

from app.services.dashboard.officer_analytics_service import (
    OfficerAnalyticsService,
)

from app.schemas.common import ApiResponse
from app.utils.response import success_response

router = APIRouter(
    prefix="/admin",
    tags=["Officer Analytics"],
)


@router.get(
    "/officer-analytics",
    summary="Get Officer Analytics",
    description="Returns officer-wise complaint analytics and performance statistics for the admin dashboard.",
    response_model=ApiResponse[dict],
    responses={
        200: {"description": "Officer analytics fetched successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
    },
)
def officer_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    service = OfficerAnalyticsService(db)

    officer_data = service.get_officer_analytics()

    return success_response(
        message="Officer analytics fetched successfully.",
        data=officer_data,
    )