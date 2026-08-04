from fastapi import UploadFile
import json
import shutil
import os
import tempfile

from app.config.settings import settings
from app.utils.file_upload import FileUploadUtility
from app.utils.cloudinary_upload import CloudinaryUploadUtility
from app.ai.image_analyzer import ImageAnalyzer



class UploadService:

    def __init__(self):
        self.analyzer = ImageAnalyzer()

    async def upload_image(
        self,
        file: UploadFile,
    ):

        # Save locally
        local_path = await FileUploadUtility.save_image(file)

        # AI Analysis
        response = self.analyzer.analyze(local_path)

        response = response.replace("```json", "")
        response = response.replace("```", "")

        analysis = json.loads(response)

        if not analysis.get("title"):
            analysis["title"] = analysis.get("category", "Complaint")

        image_url = local_path

        if settings.STORAGE_DRIVER.lower() == "cloudinary":

            with open(local_path, "rb") as f:

                temp_file = UploadFile(
                    filename=os.path.basename(local_path),
                    file=f,
                )

                image_url = await CloudinaryUploadUtility.upload_image(
                    temp_file
                )

        elif settings.STORAGE_DRIVER.lower() == "hybrid":

            try:

                with open(local_path, "rb") as f:

                    temp_file = UploadFile(
                        filename=os.path.basename(local_path),
                        file=f,
                    )

                    image_url = await CloudinaryUploadUtility.upload_image(
                        temp_file
                    )

            except Exception:
                image_url = local_path

        return image_url, analysis