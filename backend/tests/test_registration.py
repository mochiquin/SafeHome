#!/usr/bin/env python3
"""
Test script to verify registration API functionality
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
import requests
from django.test import Client
from django.contrib.auth import get_user_model
from accounts.models import ConsentLog

User = get_user_model()

def test_registration_api():
    """Test the registration API"""
    print("🚀 Testing Registration API...")

    # Use Django test client for API testing
    client = Client()

    # Test data
    test_data = {
        'email': 'testuser@example.com',
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

    # Test 1: Registration without consent (should fail)
    print("\n📝 Test 1: Registration without consent")
    data_no_consent = test_data.copy()
    data_no_consent['consent'] = False

    response = client.post(
        '/api/auth/register/',
        data=json.dumps(data_no_consent),
        content_type='application/json'
    )

    if response.status_code == 400:
        print("✅ Missing consent correctly returns 400")
        try:
            error_data = json.loads(response.content.decode('utf-8'))
            print(f"   Error: {error_data}")
        except:
            print(f"   Error: {response.content}")
    else:
        print(f"❌ Expected 400, got {response.status_code}")
        return False

    # Test 2: Registration with mismatched passwords (should fail)
    print("\n📝 Test 2: Registration with mismatched passwords")
    data_bad_password = test_data.copy()
    data_bad_password['password_confirm'] = 'different_password'

    response = client.post(
        '/api/auth/register/',
        data=json.dumps(data_bad_password),
        content_type='application/json'
    )

    if response.status_code == 400:
        print("✅ Mismatched passwords correctly returns 400")
        try:
            error_data = json.loads(response.content.decode('utf-8'))
            print(f"   Error: {error_data}")
        except:
            print(f"   Error: {response.content}")
    else:
        print(f"❌ Expected 400, got {response.status_code}")
        return False

    # Test 3: Successful registration
    print("\n📝 Test 3: Successful registration")
    response = client.post(
        '/api/auth/register/',
        data=json.dumps(test_data),
        content_type='application/json'
    )

    if response.status_code == 201:
        print("✅ Registration successful (201)")
        try:
            response_data = json.loads(response.content.decode('utf-8'))
            print(f"   Response: {response_data}")
        except:
            print(f"   Response: {response.content}")

        # Verify user was created
        try:
            user = User.objects.get(email=test_data['email'])
            print(f"✅ User created in database: {user.email}")

            # Verify consent log was created
            consent_logs = ConsentLog.objects.filter(user=user)
            if consent_logs.exists():
                consent_log = consent_logs.first()
                print(f"✅ Consent log created: {consent_log.policy_version}")
            else:
                print("❌ Consent log not found")
                return False

        except User.DoesNotExist:
            print("❌ User not found in database")
            return False

    else:
        print(f"❌ Expected 201, got {response.status_code}")
        try:
            error_data = json.loads(response.content.decode('utf-8'))
            print(f"   Error: {error_data}")
        except:
            print(f"   Error: {response.content}")
        return False

    # Test 4: Duplicate email registration (should fail)
    print("\n📝 Test 4: Duplicate email registration")
    response = client.post(
        '/api/auth/register/',
        data=json.dumps(test_data),
        content_type='application/json'
    )

    if response.status_code == 400:
        print("✅ Duplicate email correctly returns 400")
        try:
            error_data = json.loads(response.content.decode('utf-8'))
            print(f"   Error: {error_data}")
        except:
            print(f"   Error: {response.content}")
    else:
        print(f"❌ Expected 400, got {response.status_code}")
        return False

    return True


def test_user_profile_api():
    """Test the user profile API"""
    print("\n🚀 Testing User Profile API...")

    client = Client()

    # First, register a user to test profile access
    test_data = {
        'email': 'profiletest@example.com',
        'username': 'profiletest',
        'first_name': 'Profile',
        'last_name': 'Test',
        'password': 'testpass123',
        'password_confirm': 'testpass123',
        'consent': True,
        'role': 'customer',
        'city': 'Profile City',
        'vaccinated': False
    }

    # Register user
    response = client.post(
        '/api/auth/register/',
        data=json.dumps(test_data),
        content_type='application/json'
    )

    if response.status_code != 201:
        print("❌ Could not register test user for profile test")
        return False

    # Note: In a real scenario, we would need to implement JWT login
    # For now, we'll just verify the registration created the user correctly
    try:
        user = User.objects.get(email=test_data['email'])
        print(f"✅ Profile test user created: {user.email}")
        print(f"   Role: {user.role}")
        print(f"   City: {user.city}")
        print(f"   Vaccinated: {user.vaccinated}")
        return True
    except User.DoesNotExist:
        print("❌ Profile test user not found")
        return False


if __name__ == '__main__':
    print("🧪 Testing SafeHome Registration API...")

    success = True
    success &= test_registration_api()
    success &= test_user_profile_api()

    if success:
        print("\n🎉 All registration tests passed!")
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)
