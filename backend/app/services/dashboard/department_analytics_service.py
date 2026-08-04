from app.repositories.dashboard.department_analytics_repository import (
    DepartmentAnalyticsRepository,
)


class DepartmentAnalyticsService:

    def __init__(self, db):
        self.repo = DepartmentAnalyticsRepository(db)

    def get_department_analytics(self):

        total_complaints = [
            {
                "department": row.name,
                "total": row.total,
            }
            for row in self.repo.complaints_by_department()
        ]

        pending = [
            {
                "department": row.name,
                "pending": row.pending,
            }
            for row in self.repo.pending_by_department()
        ]

        resolved = [
            {
                "department": row.name,
                "resolved": row.resolved,
            }
            for row in self.repo.resolved_by_department()
        ]

        average_resolution_time = [
            {
                "department": row.name,
                "avg_hours": round(row.avg_hours, 2),
            }
            for row in self.repo.average_resolution_time()
        ]

        return {
            "total_complaints": total_complaints,
            "pending": pending,
            "resolved": resolved,
            "average_resolution_time": average_resolution_time,
        }