from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.rbac import require_admin
from app.services.dashboard.analytics_service import AnalyticsService
from app.schemas.common import ApiResponse
from app.utils.response import success_response

router = APIRouter(
    prefix="/admin",
    tags=["Admin Analytics"],
)


@router.get(
    "/analytics",
    summary="Get Analytics",
    description="Returns overall analytics for the admin dashboard.",
    response_model=ApiResponse[dict],
    responses={
        200: {"description": "Analytics fetched successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
    },
)
def analytics(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    service = AnalyticsService(db)

    analytics_data = service.get_analytics()

    return success_response(
        message="Analytics fetched successfully.",
        data=analytics_data,
    )