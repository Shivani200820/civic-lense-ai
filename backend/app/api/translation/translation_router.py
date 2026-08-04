from fastapi import APIRouter

from app.schemas.translation import (
    TranslationRequest,
    TranslationResponse,
)
from app.services.translation.translation_service import TranslationService

router = APIRouter(
    prefix="/translate",
    tags=["Translation"],
)


@router.post(
    "",
    response_model=TranslationResponse,
)
def translate(
    request: TranslationRequest,
):

    translated = TranslationService.translate(
        request.text,
        request.target_language,
    )

    return TranslationResponse(
        translated_text=translated
    )