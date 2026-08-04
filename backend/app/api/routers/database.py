from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.database import DatabaseHealthResponse

router = APIRouter(
    prefix="/database",
    tags=["Database"]
)


@router.get(
    "/health",
    summary="Database Health Check",
    description="Checks whether the application can successfully connect to the database.",
    response_model=DatabaseHealthResponse,
    responses={
        200: {"description": "Database connection successful"},
        500: {"description": "Database connection failed"},
    },
)
def database_health(db: Session = Depends(get_db)):

    db.execute(text("SELECT 1"))

    return DatabaseHealthResponse(
        status="Database Connected Successfully"
    )