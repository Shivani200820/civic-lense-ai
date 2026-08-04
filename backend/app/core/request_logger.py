import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        start = time.time()

        response = await call_next(request)

        duration = time.time() - start

        logger.info(
            f"{request.method} {request.url.path} "
            f"{response.status_code} "
            f"{duration:.3f}s"
        )

        return response