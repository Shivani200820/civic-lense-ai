from enum import Enum


class UserRole(str, Enum):
    CITIZEN = "Citizen"
    OFFICER = "Officer"
    ADMIN = "Admin"


class ComplaintStatus(str, Enum):
    PENDING = "Pending"
    ACCEPTED = "Accepted"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"
    REOPENED = "Reopened"


class PriorityLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class ComplaintCategory(str, Enum):
    ROAD = "Road"
    GARBAGE = "Garbage"
    WATER = "Water"
    ELECTRICITY = "Electricity"
    STREET_LIGHT = "Street Light"
    DRAINAGE = "Drainage"
    OTHER = "Other"

