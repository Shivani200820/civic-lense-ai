from app.schemas.complaint_priority import ComplaintPriorityCreate

priority = ComplaintPriorityCreate(
    name="High",
    description="Requires immediate attention",
    level=3,
    color="Orange",
)

print(priority)