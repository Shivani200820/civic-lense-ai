from fastapi import (
    FastAPI,
    Request,
    HTTPException,
)
from fastapi.responses import JSONResponse
from fastapi.exceptions import (
    RequestValidationError,
)

from app.core.exceptions import CivicAIException
from app.utils.response import error_response
from app.core.logging import logger


def register_exception_handlers(
    app: FastAPI
):

    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request,
        exc: HTTPException,
    ):

        if isinstance(exc.detail, dict):
            response = error_response(
                message=exc.detail.get("message", "Request failed"),
                errors=exc.detail,
            )
        else:
            response = error_response(
                message=str(exc.detail),
                errors=None,
            )

        return JSONResponse(
            status_code=exc.status_code,
            content=response.model_dump(),
        )


    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        response = error_response(
            message="Validation Error",
            errors=exc.errors(),
        )

        return JSONResponse(
            status_code=422,
            content=response.model_dump(),
        )

    @app.exception_handler(CivicAIException)
    async def civic_exception_handler(
        request: Request,
        exc: CivicAIException
    ):

        response = error_response(
            message=exc.message,
            errors=None,
        )

        return JSONResponse(
            status_code=exc.status_code,
            content=response.model_dump(),
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(
        request: Request,
        exc: Exception,
    ):
        # Actual error log मध्ये जाईल
        logger.exception(exc)

        response = error_response(
            message="Internal Server Error",
            errors=None,
        )

        return JSONResponse(
            status_code=500,
            content=response.model_dump(),
        )