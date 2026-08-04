COMPLAINT_STATUSES = [
    {
        "name": "Pending",
        "description": "Waiting for officer acceptance",
        "sequence": 1,
        "is_final": False,
    },
    {
        "name": "Accepted",
        "description": "Complaint accepted",
        "sequence": 2,
        "is_final": False,
    },
    {
        "name": "In Progress",
        "description": "Work has started",
        "sequence": 3,
        "is_final": False,
    },
    {
        "name": "Resolved",
        "description": "Issue resolved by officer",
        "sequence": 4,
        "is_final": False,
    },
    {
        "name": "Closed",
        "description": "Citizen confirmed resolution",
        "sequence": 5,
        "is_final": True,
    },
    {
        "name": "Reopened",
        "description": "Citizen rejected resolution",
        "sequence": 6,
        "is_final": False,
    },

        {
        "name": "Rejected",
        "description": "Complaint rejected",
        "sequence": 7,
        "is_final": True,
    },
]