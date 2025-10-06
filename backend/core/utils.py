"""
Utility functions for SafeHome project
"""
from rest_framework.response import Response
from rest_framework import status


def create_response(data=None, message="", success=True, status_code=status.HTTP_200_OK):
    """
    Create a standardized API response format

    Args:
        data: The response data (dict, list, or any serializable object)
        message: Success or error message
        success: Boolean indicating if the request was successful
        status_code: HTTP status code

    Returns:
        Response object with standardized format
    """
    response_data = {
        'success': success,
        'message': message,
        'status_code': status_code
    }

    if data is not None:
        response_data['data'] = data

    return Response(response_data, status=status_code)


def success_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    """Create a successful response"""
    return create_response(data=data, message=message, success=True, status_code=status_code)


def error_response(message="Error", status_code=status.HTTP_400_BAD_REQUEST):
    """Create an error response"""
    return create_response(data=None, message=message, success=False, status_code=status_code)


def validation_error_response(errors):
    """Create a validation error response"""
    return create_response(
        data={'errors': errors},
        message="Validation failed",
        success=False,
        status_code=status.HTTP_400_BAD_REQUEST
    )
