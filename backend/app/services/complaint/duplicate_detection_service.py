from math import radians, sin, cos, sqrt, atan2

from sqlalchemy.orm import Session

from app.models.complaint import Complaint
from app.constants.complaint_status import ComplaintStatus

class DuplicateDetectionService:

    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def calculate_distance(
        lat1,
        lon1,
        lat2,
        lon2,
    ):
        R = 6371

        d_lat = radians(lat2 - lat1)
        d_lon = radians(lon2 - lon1)

        a = (
            sin(d_lat / 2) ** 2
            + cos(radians(lat1))
            * cos(radians(lat2))
            * sin(d_lon / 2) ** 2
        )

        c = 2 * atan2(
            sqrt(a),
            sqrt(1 - a),
        )

        return R * c

    def get_candidate_complaints(
        self,
        category_id: int,
    ):

        return (
            self.db.query(Complaint)
            .filter(
                Complaint.category_id == category_id,
                Complaint.status_id != ComplaintStatus.CLOSED,
            )
            .all()
        )

    def find_duplicate(
        self,
        latitude: float,
        longitude: float,
        category_id: int,
        radius_km: float = 0.5,
    ):

        complaints = self.get_candidate_complaints(
            category_id
        )

        for complaint in complaints:

            distance = self.calculate_distance(
                latitude,
                longitude,
                complaint.latitude,
                complaint.longitude,
            )

            if distance <= radius_km:
                return complaint

        return None