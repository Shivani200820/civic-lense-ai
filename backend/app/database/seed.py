from sqlalchemy.orm import Session

from app.models.department import Department
from app.models.complaint_category import ComplaintCategory
from app.models.complaint_priority import ComplaintPriority
from app.models.complaint_status import ComplaintStatus

from app.data.departments import DEPARTMENTS
from app.data.complaint_categories import COMPLAINT_CATEGORIES
from app.data.complaint_priorities import COMPLAINT_PRIORITIES
from app.data.complaint_statuses import COMPLAINT_STATUSES

def seed_table(
    db: Session,
    model,
    data: list[dict],
    unique_field: str = "name",
):
    """
    Generic database seeder.

    Inserts only missing records.
    """

    for item in data:

        exists = (
            db.query(model)
            .filter(
                getattr(model, unique_field) == item[unique_field]
            )
            .first()
        )

        if exists:
            continue

        db.add(model(**item))

    db.commit()

def seed_departments(db: Session):

    seed_table(
        db,
        Department,
        DEPARTMENTS,
    )


def seed_categories(db: Session):

    seed_table(
        db,
        ComplaintCategory,
        COMPLAINT_CATEGORIES,
    )


def seed_priorities(db: Session):

    seed_table(
        db,
        ComplaintPriority,
        COMPLAINT_PRIORITIES,
        unique_field="level",
    )


def seed_statuses(db: Session):

    seed_table(
        db,
        ComplaintStatus,
        COMPLAINT_STATUSES,
        unique_field="sequence",
    )

def run_seeders(db: Session):
    """
    Runs all application seeders.
    """

    seed_departments(db)
    seed_categories(db)
    seed_priorities(db)
    seed_statuses(db)

    print("✅ Master data seeded successfully.")