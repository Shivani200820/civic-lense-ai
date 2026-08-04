from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import require_role

from app.models.user import User
from app.schemas.complaint_category import (
    ComplaintCategoryCreate,
    ComplaintCategoryUpdate,
    ComplaintCategoryResponse,
)
from app.services.complaint_category_service import (
    ComplaintCategoryService,
)
from app.shared.enums import UserRole
from app.schemas.common import ApiResponse
from app.utils.response import success_response

router = APIRouter(
    prefix="/complaint-categories",
    tags=["Complaint Categories"],
)


@router.post(
    "",
    summary="Create Complaint Category",
    description="Creates a new complaint category. Only administrators can perform this operation.",
    response_model=ApiResponse[ComplaintCategoryResponse],
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Category created successfully"},
        400: {"description": "Invalid request"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
        422: {"description": "Validation error"},
    },
)
def create_category(
    category_data: ComplaintCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    service = ComplaintCategoryService(db)

    category = service.create_category(category_data)

    return success_response(
        message="Category created successfully.",
        data=category,
    )

@router.get(
    "",
    summary="Get All Complaint Categories",
    description="Returns the list of all complaint categories.",
    response_model=ApiResponse[list[ComplaintCategoryResponse]],
    responses={
        200: {"description": "Categories fetched successfully"},
        401: {"description": "Unauthorized"},
    },
)
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintCategoryService(db)

    categories = service.get_categories()

    return success_response(
        message="Categories fetched successfully.",
        data=categories,
    )
@router.get(
    "/{category_id}",
    summary="Get Complaint Category",
    description="Returns a complaint category using its ID.",
    response_model=ApiResponse[ComplaintCategoryResponse],
    responses={
        200: {"description": "Category fetched successfully"},
        401: {"description": "Unauthorized"},
        404: {"description": "Category not found"},
    },
)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ComplaintCategoryService(db)

    category = service.get_category(category_id)

    return success_response(
        message="Category fetched successfully.",
        data=category,
    )

@router.put(
    "/{category_id}",
    summary="Update Complaint Category",
    description="Updates an existing complaint category. Only administrators can perform this operation.",
    response_model=ApiResponse[ComplaintCategoryResponse],
    responses={
        200: {"description": "Category updated successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
        404: {"description": "Category not found"},
        422: {"description": "Validation error"},
    },
)
def update_category(
    category_id: int,
    category_data: ComplaintCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    service = ComplaintCategoryService(db)

    category = service.update_category(
        category_id,
        category_data,
    )

    return success_response(
        message="Category updated successfully.",
        data=category,
    )


@router.patch(
    "/{category_id}/activate",
    summary="Activate Complaint Category",
    description="Activates a complaint category. Only administrators can perform this operation.",
    response_model=ApiResponse[ComplaintCategoryResponse],
    responses={
        200: {"description": "Category activated successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
        404: {"description": "Category not found"},
    },
)
def activate_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    service = ComplaintCategoryService(db)

    category = service.activate_category(category_id)

    return success_response(
        message="Category activated successfully.",
        data=category,
    )

@router.patch(
    "/{category_id}/deactivate",
    summary="Deactivate Complaint Category",
    description="Deactivates a complaint category. Only administrators can perform this operation.",
    response_model=ApiResponse[ComplaintCategoryResponse],
    responses={
        200: {"description": "Category deactivated successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
        404: {"description": "Category not found"},
    },
)
def deactivate_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    service = ComplaintCategoryService(db)

    category = service.deactivate_category(category_id)

    return success_response(
        message="Category deactivated successfully.",
        data=category,
    )