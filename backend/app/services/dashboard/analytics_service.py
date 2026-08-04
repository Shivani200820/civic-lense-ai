from app.repositories.dashboard.analytics_repository import (
    AnalyticsRepository,
)


class AnalyticsService:

    def __init__(self, db):
        self.repo = AnalyticsRepository(db)

    def get_analytics(self):

        category_data = [
            {
                "name": row.name,
                "count": row.count,
            }
            for row in self.repo.complaints_by_category()
        ]

        department_data = [
            {
                "name": row.name,
                "count": row.count,
            }
            for row in self.repo.complaints_by_department()
        ]

        trend_data = [
            {
                "date": str(row.date),
                "count": row.count,
            }
            for row in self.repo.complaints_last_7_days()
        ]

        return {
            "today": self.repo.complaints_today(),
            "this_month": self.repo.complaints_this_month(),
            "category_wise": category_data,
            "department_wise": department_data,
            "last_7_days": trend_data,
        }