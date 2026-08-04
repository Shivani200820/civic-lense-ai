from enum import IntEnum


class ComplaintStatus(IntEnum):
    PENDING = 1
    ACCEPTED = 2
    IN_PROGRESS = 3
    RESOLVED = 4
    CLOSED = 5
    REOPENED = 6
    REJECTED = 7


ALLOWED_STATUS_TRANSITIONS = {
    ComplaintStatus.PENDING: [
        ComplaintStatus.ACCEPTED,
        ComplaintStatus.REJECTED,
    ],

    ComplaintStatus.ACCEPTED: [
        ComplaintStatus.IN_PROGRESS,
    ],

    ComplaintStatus.IN_PROGRESS: [
        ComplaintStatus.RESOLVED,
    ],

    ComplaintStatus.RESOLVED: [
        ComplaintStatus.CLOSED,
        ComplaintStatus.REOPENED,
    ],

    ComplaintStatus.REOPENED: [
        ComplaintStatus.IN_PROGRESS,
    ],
}


def is_valid_transition(
    current_status: ComplaintStatus,
    new_status: ComplaintStatus,
) -> bool:

    return new_status in ALLOWED_STATUS_TRANSITIONS.get(
        current_status,
        [],
    )