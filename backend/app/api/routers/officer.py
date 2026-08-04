from fastapi import APIRouter, Depends

from app.dependencies.rbac import require_role
from app.models.user import User
from app.shared.enums import UserRole
from app.schemas.common import ApiResponse
from app.utils.response import success_response

router = APIRouter(
    prefix="/officer",
    tags=["Officer"],
)


@router.get(
    "/dashboard",
    summary="Officer Dashboard",
    description="Returns the dashboard for officers. Accessible only to users with Officer or Admin role.",
    response_model=ApiResponse[str],
    responses={
        200: {"description": "Officer dashboard fetched successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Officer or Admin access required"},
    },
)
def officer_dashboard(
    current_user: User = Depends(
        require_role(
            UserRole.OFFICER,
            UserRole.ADMIN,
        )
    ),
):
    return success_response(
        message="Officer dashboard loaded successfully.",
        data=f"Welcome Officer {current_user.full_name}",
    )