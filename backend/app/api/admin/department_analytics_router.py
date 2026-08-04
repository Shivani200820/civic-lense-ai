from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.rbac import require_admin

from app.services.dashboard.department_analytics_service import (
    DepartmentAnalyticsService,
)

from app.schemas.common import ApiResponse
from app.utils.response import success_response

router = APIRouter(
    prefix="/admin",
    tags=["Department Analytics"],
)


@router.get(
    "/department-analytics",
    summary="Get Department Analytics",
    description="Returns department-wise complaint analytics for the admin dashboard.",
    response_model=ApiResponse[dict],
    responses={
        200: {"description": "Department analytics fetched successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
    },
)
def department_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):

    service = DepartmentAnalyticsService(db)

    department_data = service.get_department_analytics()

    return success_response(
        message="Department analytics fetched successfully.",
        data=department_data,
    )