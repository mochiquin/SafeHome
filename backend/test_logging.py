#!/usr/bin/env python3
"""
Test script to verify logging and middleware functionality
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safehome.settings')
django.setup()

import logging
from django.test import RequestFactory
from django.contrib.auth.models import AnonymousUser
from django.http import Http404
from rest_framework.exceptions import ValidationError

# Import our middleware
from core.middleware import RequestLoggingMiddleware, ErrorHandlingMiddleware

def test_logging():
    """Test the logging middleware"""
    print("Testing logging middleware...")

    # Set up logger
    logger = logging.getLogger('safehome')

    # Test basic logging
    logger.info("Test info message")
    logger.warning("Test warning message")
    logger.error("Test error message")

    print("✓ Basic logging test completed")


def test_request_logging():
    """Test request logging middleware"""
    print("Testing request logging middleware...")

    # Create a mock request
    factory = RequestFactory()
    request = factory.get('/test/', HTTP_USER_AGENT='test-agent')

    # Create a simple mock response
    from django.http import HttpResponse
    mock_response = HttpResponse(status=200)

    # Create middleware instance
    middleware = RequestLoggingMiddleware(lambda r: mock_response)

    # Process request (this should log the request)
    try:
        response = middleware(request)
        print("✓ Request logging middleware test completed")
    except Exception as e:
        print(f"Request logging test failed: {e}")


def test_error_handling():
    """Test error handling middleware"""
    print("Testing error handling middleware...")

    # Create middleware instance
    middleware = ErrorHandlingMiddleware(lambda r: None)

    # Create a request that will cause an error
    factory = RequestFactory()
    request = factory.get('/test/')

    # Mock an exception
    def failing_view(request):
        raise ValueError("Test validation error")

    error_middleware = ErrorHandlingMiddleware(failing_view)

    try:
        response = error_middleware(request)
        if response.status_code == 400:
            print("✓ Error handling middleware test completed")
        else:
            print(f"Unexpected status code: {response.status_code}")
    except Exception as e:
        print(f"Error handling test failed: {e}")


if __name__ == '__main__':
    print("🚀 Testing SafeHome logging and middleware...")
    print()

    test_logging()
    print()

    test_request_logging()
    print()

    test_error_handling()
    print()

    print("✅ All tests completed!")
