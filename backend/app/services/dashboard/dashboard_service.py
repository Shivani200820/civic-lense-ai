from app.repositories.dashboard.dashboard_repository import DashboardRepository

from app.constants.complaint_status import ComplaintStatus

from app.services.dashboard.analytics_service import AnalyticsService
from app.services.dashboard.department_analytics_service import DepartmentAnalyticsService
from app.services.dashboard.officer_analytics_service import OfficerAnalyticsService
from app.services.dashboard.citizen_analytics_service import CitizenAnalyticsService
from app.services.dashboard.chart_service import ChartService
from app.services.dashboard.recent_activity_service import RecentActivityService

class DashboardService:

    def __init__(self, db):
        self.db = db
        self.repo = DashboardRepository(db)

    def dashboard(self):

        return {

            "total_users":
                self.repo.total_users(),

            "total_departments":
                self.repo.total_departments(),

            "total_complaints":
                self.repo.total_complaints(),

            "pending":
                self.repo.complaints_by_status(
                    ComplaintStatus.PENDING
                ),

            "accepted":
                self.repo.complaints_by_status(
                    ComplaintStatus.ACCEPTED
                ),

            "in_progress":
                self.repo.complaints_by_status(
                    ComplaintStatus.IN_PROGRESS
                ),

            "resolved":
                self.repo.complaints_by_status(
                    ComplaintStatus.RESOLVED
                ),

            "closed":
                self.repo.complaints_by_status(
                    ComplaintStatus.CLOSED
                ),

            "reopened":
                self.repo.complaints_by_status(
                    ComplaintStatus.REOPENED
                ),

            "rejected":
                self.repo.complaints_by_status(
                    ComplaintStatus.REJECTED
                ),
        }
    
    def get_complete_dashboard(self):

        return {

            "statistics": self.dashboard(),

            "analytics":
                AnalyticsService(
                    self.db
                ).get_analytics(),

            "department":
                DepartmentAnalyticsService(
                    self.db
                ).get_department_analytics(),

            "officer":
                OfficerAnalyticsService(
                    self.db
                ).get_officer_analytics(),

            "citizen":
                CitizenAnalyticsService(
                    self.db
                ).get_citizen_analytics(),

            "charts":
                ChartService(
                    self.db
                ).dashboard_charts(),

            "recent_activity":
                RecentActivityService(
                    self.db
                ).get_recent_activity(),
        }