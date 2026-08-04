from fastapi import (
    APIRouter,
    Depends,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.services.notification_service import NotificationService

from app.schemas.common import ApiResponse
from app.utils.response import success_response
from app.schemas.notification import NotificationResponse

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)

@router.get(
    "",
    summary="Get My Notifications",
    description="Returns all notifications of the logged in user.",
    response_model=ApiResponse[list[NotificationResponse]],
    responses={
        200: {
            "description": "Notifications fetched successfully"
        }
    },
)
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    service = NotificationService(db)

    notifications = service.get_notifications(
        current_user.id
    )

    return success_response(
        message="Notifications fetched successfully.",
        data=notifications,
    )

@router.patch(
    "/{notification_id}/read",
    summary="Mark Notification Read",
    description="Marks a notification as read.",
    response_model=ApiResponse[NotificationResponse],
)
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    service = NotificationService(db)

    notification = service.mark_as_read(
        notification_id,
        current_user.id,
    )

    return success_response(
        message="Notification marked as read.",
        data=notification,
    )

@router.get(
    "/unread-count",
    summary="Unread Notification Count",
    response_model=ApiResponse[int],
)
def unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    service = NotificationService(db)

    count = service.unread_count(
        current_user.id
    )

    return success_response(
        message="Unread notification count.",
        data=count,
    )

@router.patch(
    "/read-all",
    summary="Mark All Notifications Read",
    response_model=ApiResponse[int],
)
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NotificationService(db)

    count = service.mark_all_as_read(
        current_user.id
    )

    return success_response(
        message="All notifications marked as read.",
        data=count,
    )

@router.delete(
    "/{notification_id}",
    summary="Delete Notification",
    response_model=ApiResponse,
)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = NotificationService(db)

    service.delete_notification(
        notification_id,
        current_user.id,
    )

    return success_response(
        message="Notification deleted successfully."
    )