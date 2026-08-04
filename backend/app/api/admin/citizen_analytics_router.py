from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.rbac import require_admin

from app.services.dashboard.citizen_analytics_service import (
    CitizenAnalyticsService,
)

from app.schemas.common import ApiResponse
from app.utils.response import success_response

router = APIRouter(
    prefix="/admin",
    tags=["Citizen Analytics"],
)


@router.get(
    "/citizen-analytics",
    summary="Get Citizen Analytics",
    description="Returns analytics and statistics related to citizens for the admin dashboard.",
    response_model=ApiResponse[dict],
    responses={
        200: {"description": "Citizen analytics fetched successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
    },
)
def citizen_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    analytics = CitizenAnalyticsService(db).get_citizen_analytics()

    return success_response(
        message="Citizen analytics fetched successfully.",
        data=analytics,
    )