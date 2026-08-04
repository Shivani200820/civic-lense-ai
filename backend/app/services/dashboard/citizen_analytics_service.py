from app.repositories.dashboard.citizen_analytics_repository import (
    CitizenAnalyticsRepository,
)


class CitizenAnalyticsService:

    def __init__(self, db):
        self.repo = CitizenAnalyticsRepository(db)

    def get_citizen_analytics(self):

        return {
            "submitted": [
                {
                    "full_name": row.full_name,
                    "submitted": row.submitted,
                }
                for row in self.repo.complaints_submitted()
            ],

            "active": [
                {
                    "full_name": row.full_name,
                    "active": row.active,
                }
                for row in self.repo.active_complaints()
            ],

            "closed": [
                {
                    "full_name": row.full_name,
                    "closed": row.closed,
                }
                for row in self.repo.closed_complaints()
            ],

            "community_support": [
                {
                    "full_name": row.full_name,
                    "support_count": row.support_count,
                }
                for row in self.repo.community_support()
            ],
        }