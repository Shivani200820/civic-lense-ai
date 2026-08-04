from fastapi import Depends, HTTPException, status

from app.dependencies.auth import get_current_user
from app.models.user import User
from app.shared.enums import UserRole


def require_role(*allowed_roles: UserRole):
    """
    Dependency to restrict access based on user role.
    """

    def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:

        if current_user.role not in allowed_roles:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )

        return current_user

    return role_checker



require_officer = require_role(
    UserRole.OFFICER
)

require_admin = require_role(
    UserRole.ADMIN
)

require_citizen = require_role(
    UserRole.CITIZEN
)