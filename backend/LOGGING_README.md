# SafeHome Logging & Error Handling

## Overview

This project includes a comprehensive logging system and error handling middleware to provide better observability and debugging capabilities for the Django REST API.

## Features

### 📊 Logging System

- **Structured Logging**: All logs include detailed information with timestamps, log levels, and context
- **Multiple Log Levels**: INFO, WARNING, ERROR, and CRITICAL levels for different types of events
- **File-based Logging**: Separate log files for different types of events:
  - `logs/access.log` - General application logs
  - `logs/error.log` - Error and exception logs
  - `logs/security.log` - Security-related events
- **Console Output**: Real-time logging to console for development

### 🔍 Request Tracking

- **Unique Request IDs**: Each HTTP request gets a unique ID for tracking
- **Request/Response Logging**: Logs all incoming requests and outgoing responses
- **Performance Monitoring**: Tracks response times for performance analysis
- **Client IP Detection**: Logs real client IP addresses (including behind proxies)

### 🛠️ Error Handling

- **Global Exception Handling**: Catches and processes all unhandled exceptions
- **Structured Error Responses**: Returns consistent JSON error responses
- **Error Classification**: Different handling for validation errors, API errors, and server errors
- **DRF Integration**: Custom exception handler for Django REST Framework

## Configuration

### Log Files Location

All log files are stored in `backend/logs/` directory:

```
backend/
├── logs/
│   ├── access.log      # General application logs
│   ├── error.log       # Error and exception logs
│   └── security.log    # Security-related events
```

### Log Levels

- **INFO**: General information, requests, responses
- **WARNING**: Security events, deprecated features
- **ERROR**: Exceptions, errors, failures
- **CRITICAL**: Critical system issues

### Environment Variables

Add these to your `.env` file:

```bash
# Logging
DJANGO_LOG_LEVEL=INFO
```

## Usage Examples

### Basic Logging

```python
import logging

logger = logging.getLogger('safehome')

# General information
logger.info("User registration completed", extra={'user_id': 123})

# Security events
logger.warning("Suspicious login attempt", extra={
    'ip': '192.168.1.1',
    'user_agent': 'suspicious-agent'
})

# Errors
logger.error("Database connection failed", exc_info=True)
```

### Middleware Features

The middleware automatically logs:
- All HTTP requests with method, path, IP address
- Response status codes and processing times
- Request IDs for tracking across logs
- Exception details with full stack traces

### Error Response Format

```json
{
    "error": "Validation Error",
    "message": "Invalid input data provided",
    "details": {
        "field_name": ["This field is required"]
    }
}
```

## Testing

Run the test script to verify functionality:

```bash
# In the backend container
python test_logging.py
```

Expected output:
```
🚀 Testing SafeHome logging and middleware...

Testing logging middleware...
INFO Test info message
WARNING Test warning message
ERROR Test error message
✓ Basic logging test completed

Testing request logging middleware...
INFO Request 123456789: GET /test/ from 127.0.0.1
✓ Request logging middleware test completed

Testing error handling middleware...
ERROR Unhandled exception in request 987654321: Test validation error
✓ Error handling middleware test completed

✅ All tests completed!
```

## Log Format

### Access Log Format
```
2024-01-15 10:30:45 INFO safehome Request 140234567890123: GET /api/services from 127.0.0.1
2024-01-15 10:30:45 INFO safehome Response 140234567890123: 200 in 0.123s
```

### Error Log Format
```
2024-01-15 10:30:45 ERROR safehome Unhandled exception in request 140234567890123: Validation error
Traceback (most recent call last):
  File "/app/core/middleware.py", line 80, in __call__
    ...
ValueError: Invalid input data
```

## Best Practices

1. **Use Structured Logging**: Always include relevant context in `extra` parameters
2. **Log Security Events**: Use WARNING level for authentication failures, suspicious activities
3. **Monitor Error Rates**: Set up monitoring on error logs for production alerts
4. **Request Tracking**: Use request IDs to trace issues across multiple log entries
5. **Performance Monitoring**: Monitor response times for performance optimization

## Troubleshooting

### Common Issues

1. **Logs not appearing**: Check log file permissions and disk space
2. **High log volume**: Adjust log levels or implement log rotation
3. **Performance impact**: Monitor middleware overhead in high-traffic scenarios

### Debug Mode

In development, enable DEBUG mode for more detailed error information:

```python
DEBUG = True  # In settings.py
```

This provides stack traces and detailed error information in responses.
