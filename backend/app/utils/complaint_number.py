from datetime import datetime
import uuid


def generate_complaint_number() -> str:
    """
    Example:
    CMP-2026-8F4A2C
    """
    year = datetime.now().year
    unique_part = uuid.uuid4().hex[:6].upper()

    return f"CMP-{year}-{unique_part}"