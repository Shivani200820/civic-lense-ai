from app.data.departments import DEPARTMENTS
from app.data.complaint_categories import COMPLAINT_CATEGORIES
from app.data.complaint_priorities import COMPLAINT_PRIORITIES
from app.data.complaint_statuses import COMPLAINT_STATUSES

print(f"Departments: {len(DEPARTMENTS)}")
print(f"Categories: {len(COMPLAINT_CATEGORIES)}")
print(f"Priorities: {len(COMPLAINT_PRIORITIES)}")
print(f"Statuses: {len(COMPLAINT_STATUSES)}")