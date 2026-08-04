import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.config.settings import settings


class FileUploadUtility:
    """
    Handles image validation and local storage.
    """

    @staticmethod
    async def save_image(file: UploadFile) -> str:
        # Validate extension
        extension = Path(file.filename).suffix.lower().replace(".", "")

        allowed_extensions = [
            ext.strip().lower()
            for ext in settings.ALLOWED_IMAGE_EXTENSIONS.split(",")
        ]

        if extension not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image format.",
            )

        # Read file
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty file is not allowed."
            )
        
        allowed_types = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ]

        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only JPEG, PNG and WebP images are allowed."
            )


        # Validate size
        if len(content) > settings.MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image exceeds maximum size.",
            )

        # Generate unique filename
        filename = f"{uuid.uuid4()}.{extension}"

        upload_dir = settings.UPLOAD_DIRECTORY

        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, filename)

        with open(file_path, "wb") as image:
            image.write(content)

        return file_path