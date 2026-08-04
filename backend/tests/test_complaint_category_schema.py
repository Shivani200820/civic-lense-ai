from app.schemas.complaint_category import ComplaintCategoryCreate

category = ComplaintCategoryCreate(
    name="Garbage",
    description="Garbage related complaints"
)

print(category)