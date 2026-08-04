import cloudinary.uploader

from fastapi import HTTPException, UploadFile, status
from pathlib import Path
from app.config.settings import settings


class CloudinaryUploadUtility:

    @staticmethod
    async def upload_image(file: UploadFile) -> str:

        try:


            # Validate extension
            extension = Path(file.filename).suffix.lower().replace(".", "")

            allowed_extensions = ["jpg", "jpeg", "png", "webp"]

            if extension not in allowed_extensions:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid image format.",
                )

            # Read file
            content = await file.read()

            # Empty file
            if not content:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Empty file is not allowed.",
                )

            # Content type
            allowed_types = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ]

            if file.content_type not in allowed_types:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only JPEG, PNG and WebP images are allowed.",
                )

            # Size
            if len(content) > settings.MAX_IMAGE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Image exceeds maximum size.",
                )


            result = cloudinary.uploader.upload(
                content,
                folder="civicai",
            )

            return result["secure_url"]

        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e),
            )