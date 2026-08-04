from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.rbac import require_admin

from app.services.dashboard.chart_service import ChartService
from app.schemas.common import ApiResponse
from app.utils.response import success_response

router = APIRouter(
    prefix="/admin",
    tags=["Dashboard Charts"],
)


@router.get(
    "/dashboard/charts",
    summary="Get Dashboard Charts",
    description="Returns chart data used in the admin dashboard.",
    response_model=ApiResponse[dict],
    responses={
        200: {"description": "Dashboard charts fetched successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
    },
)
def dashboard_charts(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    charts = ChartService(db).dashboard_charts()

    return success_response(
        message="Dashboard charts fetched successfully.",
        data=charts,
    )