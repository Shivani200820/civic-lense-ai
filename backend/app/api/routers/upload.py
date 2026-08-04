from fastapi import APIRouter, File, UploadFile, Depends

from app.models.user import User
from app.dependencies.auth import get_current_user
from app.schemas.upload import UploadResponse
from app.services.upload_service import UploadService

router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
)


@router.post(
    "",
    summary="Upload Image",
    response_model=UploadResponse,
)
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    service = UploadService()

    image_url, analysis = await service.upload_image(file)

    return UploadResponse(
        message="Upload successful",
        image_url=image_url,
        analysis=analysis,
    )