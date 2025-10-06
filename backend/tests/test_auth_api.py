#!/usr/bin/env python3
"""
Test script to verify authentication API functionality with cookies
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safehome.settings')
django.setup()

import json
from django.test import Client
from django.contrib.auth import get_user_model

User = get_user_model()

def test_login_logout_api():
    """Test login and logout with cookie-based authentication"""
    print("Testing Login/Logout API...")

    # Use Django test client for API testing
    client = Client()

    # First, register a test user
    register_data = {
        'email': 'authtest@example.com',
        'username': 'authtest',
        'first_name': 'Auth',
        'last_name': 'Test',
        'password': 'testpass123',
        'password_confirm': 'testpass123',
        'consent': True,
        'role': 'customer',
        'city': 'Test City',
        'vaccinated': True
    }

    # Register user
    response = client.post(
        '/api/auth/register/',
        data=json.dumps(register_data),
        content_type='application/json'
    )

    if response.status_code != 201:
        print(f"FAIL: Could not register test user. Status: {response.status_code}")
        print(f"Response: {response.content}")
        return False

    print("PASS: User registered successfully")

    # Test 1: Login with valid credentials
    print("\nTest 1: Login with valid credentials")
    login_data = {
        'email': 'authtest@example.com',
        'password': 'testpass123'
    }

    response = client.post(
        '/api/auth/login/',
        data=json.dumps(login_data),
        content_type='application/json'
    )

    if response.status_code == 200:
        print("PASS: Login successful (200)")

        # Check if cookies are set
        access_cookie = response.cookies.get('access_token')
        refresh_cookie = response.cookies.get('refresh_token')

        if access_cookie and refresh_cookie:
            print("PASS: JWT cookies are set")
            print(f"   Access token cookie: {access_cookie.name}")
            print(f"   Refresh token cookie: {refresh_cookie.name}")
        else:
            print("FAIL: JWT cookies not found")
            return False

    else:
        print(f"FAIL: Expected 200, got {response.status_code}")
        error_data = json.loads(response.content.decode('utf-8'))
        print(f"   Error: {error_data}")
        return False

    # Test 2: Test /api/auth/me endpoint (should work with cookies)
    print("\nTest 2: Access user profile with cookies")
    response = client.get('/api/auth/me/')

    if response.status_code == 200:
        print("PASS: User profile accessible with cookies")
        user_data = json.loads(response.content.decode('utf-8'))
        print(f"   User email: {user_data.get('email')}")
    else:
        print(f"FAIL: Expected 200, got {response.status_code}")
        error_data = json.loads(response.content.decode('utf-8'))
        print(f"   Error: {error_data}")
        return False

    # Test 3: Logout
    print("\nTest 3: Logout clears cookies")
    response = client.post('/api/auth/logout/')

    if response.status_code == 200:
        print("PASS: Logout successful (200)")

        # Check if cookies are cleared
        logout_response = json.loads(response.content.decode('utf-8'))
        print(f"   Response: {logout_response}")

        # Check if cookies are cleared in response
        if 'access_token' in response.cookies or 'refresh_token' in response.cookies:
            print("FAIL: Cookies should be cleared")
            return False
        else:
            print("PASS: Cookies cleared successfully")

    else:
        print(f"FAIL: Expected 200, got {response.status_code}")
        return False

    # Test 4: Test /api/auth/me after logout (should fail)
    print("\nTest 4: Access user profile after logout (should fail)")
    response = client.get('/api/auth/me/')

    if response.status_code == 401:
        print("PASS: Profile access correctly fails after logout (401)")
        error_data = json.loads(response.content.decode('utf-8'))
        print(f"   Error: {error_data}")
    else:
        print(f"FAIL: Expected 401, got {response.status_code}")
        return False

    return True

if __name__ == '__main__':
    print("Testing SafeHome Authentication API...")

    success = test_login_logout_api()

    if success:
        print("\nAll authentication tests passed!")
    else:
        print("\nSome tests failed!")
        sys.exit(1)
