from app.schemas.common import ApiResponse


def success_response(message: str, data=None):

    return ApiResponse(
        success=True,
        message=message,
        data=data,
        errors=None,
    )


def error_response(message: str, errors=None):

    return ApiResponse(
        success=False,
        message=message,
        data=None,
        errors=errors,
    )