"""
Custom middleware for logging and error handling
"""
import time
import json
import logging
import traceback
from django.http import JsonResponse
from django.conf import settings
from django.core.exceptions import ValidationError
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler
from django.utils.deprecation import MiddlewareMixin

# Get logger for this module
logger = logging.getLogger('safehome')


class DisableCSRFMiddleware(MiddlewareMixin):
    """
    Middleware to disable CSRF for API endpoints that are already exempt
    """
    def process_request(self, request):
        # Exempt API endpoints from CSRF checks
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)

class RequestLoggingMiddleware:
    """Middleware to log HTTP requests and responses"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Start timing the request
        start_time = time.time()

        # Generate unique request ID for tracking
        request_id = id(request)

        # Log request details
        logger.info(
            f"Request {request_id}: {request.method} {request.path} "
            f"from {self._get_client_ip(request)}",
            extra={
                'request_id': request_id,
                'method': request.method,
                'path': request.path,
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'ip': self._get_client_ip(request),
            }
        )

        # Process the request
        response = self.get_response(request)

        # Calculate processing time
        processing_time = time.time() - start_time

        # Log response details
        logger.info(
            f"Response {request_id}: {response.status_code} in {processing_time:.3f}s",
            extra={
                'request_id': request_id,
                'status_code': response.status_code,
                'processing_time': processing_time,
            }
        )

        # Add request ID to response headers for debugging
        response['X-Request-ID'] = str(request_id)

        return response

    def _get_client_ip(self, request):
        """Get the client's real IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', 'unknown')


class ErrorHandlingMiddleware:
    """Middleware to handle and log errors consistently"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
            return response
        except Exception as e:
            return self._handle_exception(request, e)

    def _handle_exception(self, request, exception):
        """Handle different types of exceptions"""
        request_id = id(request)

        # Log the exception with full traceback
        logger.error(
            f"Unhandled exception in request {request_id}: {str(exception)}",
            extra={
                'request_id': request_id,
                'exception_type': type(exception).__name__,
                'exception_message': str(exception),
                'traceback': traceback.format_exc(),
            },
            exc_info=True
        )

        # Handle different exception types
        if isinstance(exception, ValidationError):
            return self._handle_validation_error(exception)
        elif isinstance(exception, APIException):
            return self._handle_api_exception(exception)
        elif isinstance(exception, (ValueError, TypeError)):
            return self._handle_validation_error(exception)
        else:
            # Generic server error
            return self._handle_server_error()

    def _handle_validation_error(self, exception):
        """Handle validation errors"""
        error_data = {
            'error': 'Validation Error',
            'message': str(exception) if settings.DEBUG else 'Invalid input data',
        }

        if settings.DEBUG and hasattr(exception, 'message_dict'):
            error_data['details'] = exception.message_dict

        return JsonResponse(error_data, status=400)

    def _handle_api_exception(self, exception):
        """Handle DRF API exceptions"""
        error_data = {
            'error': exception.__class__.__name__,
            'message': str(exception.detail) if hasattr(exception, 'detail') else str(exception),
        }

        # Use the exception's status code, or default to 400
        status_code = getattr(exception, 'status_code', 400)

        return JsonResponse(error_data, status=status_code)

    def _handle_server_error(self):
        """Handle generic server errors"""
        error_data = {
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred' if not settings.DEBUG else 'Check server logs for details',
        }

        return JsonResponse(error_data, status=500)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Log API exceptions
        request = context['request']
        request_id = id(request)

        logger.error(
            f"API exception in request {request_id}: {response.status_code} - {response.data}",
            extra={
                'request_id': request_id,
                'status_code': response.status_code,
                'error_data': response.data,
            }
        )

        # Add request ID to response for debugging
        response['X-Request-ID'] = str(request_id)

    return response
