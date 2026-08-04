from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.notification import Notification
from app.repositories.notification_repository import (
    NotificationRepository,
)
from app.services.translation.translation_service import TranslationService
from app.repositories.user_repository import UserRepository


class NotificationService:

    def __init__(self, db: Session):
        self.db = db
        self.repository = NotificationRepository(db)
        self.user_repository = UserRepository(db)

    def create_notification(
        self,
        user_id: int,
        title: str,
        message: str,
        notification_type: str,
    ):

        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type,
        )

        return self.repository.create(notification)

    def get_notifications(
        self,
        user_id: int,
    ):

        notifications = self.repository.get_user_notifications(
            user_id
        )

        for notification in notifications:
            self.translate_notification(
                notification
            )

        return notifications

    def mark_as_read(
        self,
        notification_id: int,
        user_id: int,
    ):

        notification = self.repository.get_by_id(
            notification_id
        )

        if notification is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found.",
            )

        if notification.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot access this notification.",
            )

        notification.is_read = True

        return self.repository.save(notification)

    def translate_notification(
        self,
        notification,
    ):
        user = self.user_repository.get_by_id(
            notification.user_id
        )

        if user:
            notification.title = TranslationService.translate(
                notification.title,
                user.language,
            )

            notification.message = TranslationService.translate(
                notification.message,
                user.language,
            )

        return notification

    def unread_count(
        self,
        user_id: int,
    ):

        return self.repository.unread_count(user_id)

    def mark_all_as_read(
        self,
        user_id: int,
    ):
        return self.repository.mark_all_as_read(
            user_id
        )

    def delete_notification(
        self,
        notification_id: int,
        user_id: int,
    ):
        notification = self.repository.get_by_id(
            notification_id
        )

        if notification is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found.",
            )

        if notification.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot delete this notification.",
            )

        self.repository.delete(
            notification
        )

        return {
            "message": "Notification deleted successfully."
        }