from app.schemas.complaint_status import (
    ComplaintStatusCreate,
)


status = ComplaintStatusCreate(
    name="Pending",
    description="Waiting for officer",
    sequence=1,
    is_final=False,
)


print(status)