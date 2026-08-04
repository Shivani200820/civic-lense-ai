from fastapi import APIRouter, Depends

from app.dependencies.rbac import require_role
from app.models.user import User
from app.shared.enums import UserRole
from app.schemas.common import ApiResponse
from app.utils.response import success_response

router = APIRouter(
    prefix="/citizen",
    tags=["Citizen"],
)


@router.get(
    "/dashboard",
    summary="Citizen Dashboard",
    description="Returns the dashboard for the currently authenticated citizen.",
    response_model=ApiResponse[str],
    responses={
        200: {"description": "Citizen dashboard fetched successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Citizen access required"},
    },
)
def citizen_dashboard(
    current_user: User = Depends(
        require_role(UserRole.CITIZEN)
    ),
):

    return success_response(
        message="Citizen dashboard loaded successfully.",
        data=f"Welcome {current_user.full_name}",
    )