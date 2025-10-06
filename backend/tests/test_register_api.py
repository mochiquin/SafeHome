#!/usr/bin/env python3
"""
Simple test script to verify registration API functionality
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

import json
from django.test import Client
from django.contrib.auth import get_user_model
from accounts.models import ConsentLog

User = get_user_model()

def test_registration_api():
    """Test the registration API"""
    print("Testing Registration API...")

    # Use Django test client for API testing
    client = Client()

    # Test data
    test_data = {
        'email': 'test@example.com',
        'username': 'testuser',
        'first_name': 'Test',
        'last_name': 'User',
        'password': 'testpass123',
        'password_confirm': 'testpass123',
        'consent': True,
        'role': 'customer',
        'city': 'Test City',
        'vaccinated': True
    }

    print("\nTest 1: Registration without consent (should fail)")
    data_no_consent = test_data.copy()
    data_no_consent['consent'] = False

    response = client.post(
        '/api/auth/register/',
        data=json.dumps(data_no_consent),
        content_type='application/json'
    )

    if response.status_code == 400:
        print("PASS: Missing consent correctly returns 400")
        error_data = json.loads(response.content.decode('utf-8'))
        print(f"   Error: {error_data}")
    else:
        print(f"FAIL: Expected 400, got {response.status_code}")
        return False

    print("\nTest 2: Registration with mismatched passwords (should fail)")
    data_bad_password = test_data.copy()
    data_bad_password['password_confirm'] = 'different_password'

    response = client.post(
        '/api/auth/register/',
        data=json.dumps(data_bad_password),
        content_type='application/json'
    )

    if response.status_code == 400:
        print("PASS: Mismatched passwords correctly returns 400")
        error_data = json.loads(response.content.decode('utf-8'))
        print(f"   Error: {error_data}")
    else:
        print(f"FAIL: Expected 400, got {response.status_code}")
        return False

    print("\nTest 3: Successful registration")
    response = client.post(
        '/api/auth/register/',
        data=json.dumps(test_data),
        content_type='application/json'
    )

    if response.status_code == 201:
        print("PASS: Registration successful (201)")
        response_data = json.loads(response.content.decode('utf-8'))
        print(f"   Response: {response_data}")

        # Verify user was created
        try:
            user = User.objects.get(email=test_data['email'])
            print(f"PASS: User created in database: {user.email}")

            # Verify consent log was created
            consent_logs = ConsentLog.objects.filter(user=user)
            if consent_logs.exists():
                consent_log = consent_logs.first()
                print(f"PASS: Consent log created: {consent_log.policy_version}")
            else:
                print("FAIL: Consent log not found")
                return False

        except User.DoesNotExist:
            print("FAIL: User not found in database")
            return False

    else:
        print(f"FAIL: Expected 201, got {response.status_code}")
        error_data = json.loads(response.content.decode('utf-8'))
        print(f"   Error: {error_data}")
        return False

    print("\nTest 4: Duplicate email registration (should fail)")
    response = client.post(
        '/api/auth/register/',
        data=json.dumps(test_data),
        content_type='application/json'
    )

    if response.status_code == 400:
        print("PASS: Duplicate email correctly returns 400")
        error_data = json.loads(response.content.decode('utf-8'))
        print(f"   Error: {error_data}")
    else:
        print(f"FAIL: Expected 400, got {response.status_code}")
        return False

    return True

if __name__ == '__main__':
    print("Testing SafeHome Registration API...")

    success = test_registration_api()

    if success:
        print("\nAll registration tests passed!")
    else:
        print("\nSome tests failed!")
        sys.exit(1)
