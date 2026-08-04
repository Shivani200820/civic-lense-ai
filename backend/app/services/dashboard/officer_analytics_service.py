from app.repositories.dashboard.officer_analytics_repository import (
    OfficerAnalyticsRepository,
)


class OfficerAnalyticsService:

    def __init__(self, db):
        self.repo = OfficerAnalyticsRepository(db)

    def get_officer_analytics(self):

        return {

            "workload": [
                {
                    "full_name": row.full_name,
                    "assigned": row.assigned,
                }
                for row in self.repo.officer_workload()
            ],

            "resolved": [
                {
                    "full_name": row.full_name,
                    "resolved": row.resolved,
                }
                for row in self.repo.resolved_complaints()
            ],

            "average_resolution_time": [
                {
                    "full_name": row.full_name,
                    "avg_hours": round(row.avg_hours, 2) if row.avg_hours is not None else None,
                }
                for row in self.repo.average_resolution_time()
            ],

            "active": [
                {
                    "full_name": row.full_name,
                    "active": row.active,
                }
                for row in self.repo.active_complaints()
            ],
        }