from app.schemas.department import DepartmentCreate

department = DepartmentCreate(
    name="Sanitation",
    description="Handles garbage collection"
)

print(department)