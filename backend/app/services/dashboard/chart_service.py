from app.repositories.dashboard.chart_repository import (
    ChartRepository,
)
from app.constants.complaint_status import ComplaintStatus

STATUS_NAMES = {
    ComplaintStatus.PENDING: "Pending",
    ComplaintStatus.ACCEPTED: "Accepted",
    ComplaintStatus.IN_PROGRESS: "In Progress",
    ComplaintStatus.RESOLVED: "Resolved",
    ComplaintStatus.CLOSED: "Closed",
    ComplaintStatus.REOPENED: "Reopened",
    ComplaintStatus.REJECTED: "Rejected",
}


class ChartService:

    def __init__(self, db):
        self.repo = ChartRepository(db)

    def dashboard_charts(self):

        return {

            "status_chart": [
                {
                    "status": STATUS_NAMES.get(row.status_id, "Unknown"),
                    "count": row.count,
                }
                for row in self.repo.complaint_status_chart()
            ],

            "department_chart": [
                {
                    "name": row.name,
                    "count": row.count,
                }
                for row in self.repo.department_chart()
            ],

            "monthly_trend": [
                {
                    "month": row.month,
                    "count": row.count,
                }
                for row in self.repo.monthly_trend()
            ],

            "officer_chart": [
                {
                    "full_name": row.full_name,
                    "assigned": row.assigned,
                }
                for row in self.repo.officer_workload_chart()
            ],

            "citizen_chart": [
                {
                    "full_name": row.full_name,
                    "submitted": row.submitted,
                }
                for row in self.repo.citizen_chart()
            ],
        }