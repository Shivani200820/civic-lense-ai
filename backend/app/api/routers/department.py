from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import require_role

from app.models.user import User
from app.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse,
)
from app.services.department_service import DepartmentService
from app.shared.enums import UserRole
from app.schemas.common import ApiResponse
from app.utils.response import success_response

router = APIRouter(
    prefix="/departments",
    tags=["Departments"],
)


@router.post(
    "",
    summary="Create Department",
    description="Creates a new complaint department. Only administrators can perform this operation.",
    response_model=ApiResponse[DepartmentResponse],
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Department created successfully"},
        400: {"description": "Invalid request"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
        422: {"description": "Validation error"},
    },
)
def create_department(
    department_data: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    service = DepartmentService(db)

    department = service.create_department(department_data)

    return success_response(
        message="Department created successfully.",
        data=department,
    )

@router.get(
    "",
    summary="Get All Departments",
    description="Returns the list of all departments.",
    response_model=ApiResponse[list[DepartmentResponse]],
    responses={
        200: {"description": "Departments fetched successfully"},
        401: {"description": "Unauthorized"},
    },
)
def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DepartmentService(db)

    departments = service.get_departments()

    return success_response(
        message="Departments fetched successfully.",
        data=departments,
    )


@router.get(
    "/{department_id}",
    summary="Get Department",
    description="Returns a department using its ID.",
    response_model=ApiResponse[DepartmentResponse],
    responses={
        200: {"description": "Department fetched successfully"},
        404: {"description": "Department not found"},
        401: {"description": "Unauthorized"},
    },
)
def get_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = DepartmentService(db)

    department = service.get_department(department_id)

    return success_response(
        message="Department fetched successfully.",
        data=department,
    )

@router.put(
    "/{department_id}",
    summary="Update Department",
    description="Updates an existing department. Only administrators can perform this operation.",
    response_model=ApiResponse[DepartmentResponse],
    responses={
        200: {"description": "Department updated successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
        404: {"description": "Department not found"},
        422: {"description": "Validation error"},
    },
)

def update_department(
    department_id: int,
    department_data: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    service = DepartmentService(db)
    department = service.update_department(
        department_id,
        department_data,
    )

    return success_response(
        message="Department updated successfully.",
        data=department,
    )


@router.patch(
    "/{department_id}/activate",
    summary="Activate Department",
    description="Activates a department. Only administrators can perform this operation.",
    response_model=ApiResponse[DepartmentResponse],
    responses={
        200: {"description": "Department activated successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
        404: {"description": "Department not found"},
    },
)
def activate_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    service = DepartmentService(db)

    department = service.activate_department(department_id)

    return success_response(
        message="Department activated successfully.",
        data=department,
    )

@router.patch(
    "/{department_id}/deactivate",
    summary="Deactivate Department",
    description="Deactivates a department. Only administrators can perform this operation.",
    response_model=ApiResponse[DepartmentResponse],
    responses={
        200: {"description": "Department deactivated successfully"},
        401: {"description": "Unauthorized"},
        403: {"description": "Admin access required"},
        404: {"description": "Department not found"},
    },
)
def deactivate_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(UserRole.ADMIN)
    ),
):
    service = DepartmentService(db)

    department = service.deactivate_department(department_id)

    return success_response(
        message="Department deactivated successfully.",
        data=department,
    )