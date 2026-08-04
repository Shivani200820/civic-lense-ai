class CivicAIException(Exception):
    """
    Base exception for the application.
    """

    def __init__(
        self,
        message: str,
        status_code: int = 400
    ):
        self.message = message
        self.status_code = status_code


class UserAlreadyExistsException(
    CivicAIException
):
    pass


class InvalidCredentialsException(
    CivicAIException
):
    pass


class UserNotFoundException(CivicAIException):
    def __init__(
        self,
        message: str = "User not found.",
    ):
        super().__init__(
            message=message,
            status_code=404,
        )

class PermissionDeniedException(
    CivicAIException
):
    pass

class DepartmentAlreadyExistsException(CivicAIException):
    def __init__(self):
        super().__init__(
            message="Department already exists.",
            status_code=400
        )


class DepartmentNotFoundException(CivicAIException):
    def __init__(self):
        super().__init__(
            message="Department not found.",
            status_code=404
        )
    
class ComplaintCategoryAlreadyExistsException(CivicAIException):
    def __init__(self):
        super().__init__(
            message="Complaint category already exists.",
            status_code=400
        )


class ComplaintCategoryNotFoundException(CivicAIException):
    def __init__(self):
        super().__init__(
            message="Complaint category not found.",
            status_code=404
        )

class ComplaintPriorityAlreadyExistsException(CivicAIException):
    def __init__(self):
        super().__init__(
            message="Complaint priority already exists.",
            status_code=400,
        )


class ComplaintPriorityLevelAlreadyExistsException(CivicAIException):
    def __init__(self):
        super().__init__(
            message="Priority level already exists.",
            status_code=400,
        )


class ComplaintPriorityNotFoundException(CivicAIException):
    def __init__(self):
        super().__init__(
            message="Complaint priority not found.",
            status_code=404,
        )

class ComplaintStatusAlreadyExistsException(CivicAIException):
    def __init__(self):
        super().__init__(
            message="Complaint status already exists.",
            status_code=400,
        )


class ComplaintStatusSequenceExistsException(CivicAIException):
    def __init__(self):
        super().__init__(
            message="Complaint status sequence already exists.",
            status_code=400,
        )


class ComplaintStatusNotFoundException(CivicAIException):
    def __init__(self):
        super().__init__(
            message="Complaint status not found.",
            status_code=404,
        )