from fastapi import APIRouter, Depends

from app.dependencies.rbac import require_role
from app.models.user import User
from app.shared.enums import UserRole

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


