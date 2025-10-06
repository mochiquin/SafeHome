#!/usr/bin/env python3
"""
Test script for booking API functionality
"""
import os
import sys
import django
from pathlib import Path
from datetime import datetime, timedelta
from unittest.mock import Mock, patch

# Add the project root to Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

# Set FERNET_KEY environment variable
os.environ['FERNET_KEY'] = 'test-fernet-key-32-characters-long-for-encryption'

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safehome.settings')
django.setup()

import json
from django.test import Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from bookings.models import Booking
from services.models import Service

User = get_user_model()


def test_booking_creation_api():
    """Test booking creation API functionality"""
    print("Testing booking creation API...")

    # Create test client
    client = Client()

    # Create test user and service first
    user = User.objects.create_user(
        email='bookingtest@example.com',
        username='bookingtest',
        password='testpass123',
        first_name='Booking',
        last_name='Test',
        role='customer',
        city='Test City'
    )

    service = Service.objects.create(
        title='Test Booking Service',
        description='A test service for booking',
        price=75.00,
        category='Testing',
        estimated_duration=3
    )

    # Login the user
    login_response = client.post('/api/auth/login/', {
        'email': 'bookingtest@example.com',
        'password': 'testpass123'
    })

    if login_response.status_code != 200:
        print(f"FAIL: Login failed. Status: {login_response.status_code}")
        print(f"Response: {login_response.content}")
        return False

    print("PASS: User login successful")

    # Test data for booking
    booking_data = {
        'service': str(service.id),
        'address': '456 Test Avenue, Sample City, SC 12345',
        'phone': '+1-555-BOOK-TEST',
        'city': 'Sample City',
        'state': 'SC',
        'country': 'US',
        'start_time': (datetime.now() + timedelta(days=1)).isoformat(),
        'duration_hours': 2,
        'notes': 'Test booking notes'
    }

    # Create booking
    response = client.post(
        '/api/bookings/create/',
        data=json.dumps(booking_data),
        content_type='application/json'
    )

    print(f"Booking creation status: {response.status_code}")

    if response.status_code == 201:
        print("PASS: Booking created successfully (201)")

        response_data = json.loads(response.content.decode('utf-8'))
        booking_id = response_data.get('id')

        if booking_id:
            print(f"Booking ID: {booking_id}")

            # Verify that the booking was created in database
            try:
                booking = Booking.objects.get(id=booking_id)

                # Check that address and phone are encrypted in database
                address_encrypted = booking.address_enc
                phone_encrypted = booking.phone_enc

                print(f"Encrypted address in DB (first 50): {address_encrypted[:50]}...")
                print(f"Encrypted phone in DB (first 50): {phone_encrypted[:50]}...")

                # Verify that encrypted data doesn't contain original plaintext
                address_str = address_encrypted.decode('utf-8', errors='ignore')
                phone_str = phone_encrypted.decode('utf-8', errors='ignore')

                if booking_data['address'] not in address_str:
                    print("PASS: Address is properly encrypted in database")
                else:
                    print("FAIL: Address found in plaintext in database")
                    return False

                if booking_data['phone'] not in phone_str:
                    print("PASS: Phone is properly encrypted in database")
                else:
                    print("FAIL: Phone found in plaintext in database")
                    return False

                # Test that we can decrypt and get original data back
                decrypted_address = booking.get_address()
                decrypted_phone = booking.get_phone()

                if decrypted_address == booking_data['address']:
                    print("PASS: Address decryption successful")
                else:
                    print(f"FAIL: Address decryption failed. Expected: {booking_data['address']}, Got: {decrypted_address}")
                    return False

                if decrypted_phone == booking_data['phone']:
                    print("PASS: Phone decryption successful")
                else:
                    print(f"FAIL: Phone decryption failed. Expected: {booking_data['phone']}, Got: {decrypted_phone}")
                    return False

            except Booking.DoesNotExist:
                print("FAIL: Booking not found in database")
                return False

        else:
            print("FAIL: No booking ID in response")
            return False

    else:
        print(f"FAIL: Expected 201, got {response.status_code}")
        error_data = json.loads(response.content.decode('utf-8'))
        print(f"Error: {error_data}")
        return False

    return True


def test_unauthorized_booking_creation():
    """Test that unauthorized users cannot create bookings"""
    print("\nTesting unauthorized booking creation...")

    client = Client()

    # Try to create booking without authentication
    booking_data = {
        'service': 'some-service-id',
        'address': 'Test Address',
        'phone': 'Test Phone',
        'city': 'Test City',
        'start_time': (datetime.now() + timedelta(days=1)).isoformat(),
        'duration_hours': 1
    }

    response = client.post(
        '/api/bookings/create/',
        data=json.dumps(booking_data),
        content_type='application/json'
    )

    if response.status_code == 401:
        print("PASS: Unauthorized booking creation correctly rejected (401)")
        return True
    else:
        print(f"FAIL: Expected 401, got {response.status_code}")
        return False


def test_booking_detail_owner_access():
    """Test that users can only access their own bookings"""
    print("\nTesting booking detail owner access...")

    client = Client()

    # Create two users
    user1 = User.objects.create_user(
        email='owner@example.com',
        username='owner',
        password='testpass123'
    )

    user2 = User.objects.create_user(
        email='other@example.com',
        username='other',
        password='testpass123'
    )

    # Create service and booking for user1
    service = Service.objects.create(
        title='Owner Test Service',
        description='Service for owner test',
        price=100.00,
        category='Test'
    )

    booking = Booking.objects.create(
        user=user1,
        service=service,
        start_time=datetime.now() + timedelta(days=2),
        duration_hours=1,
        city='Owner City',
        status='pending'
    )
    booking.set_address('Owner Address 123')
    booking.set_phone('Owner Phone 123')
    booking.save()

    # Login as user1 (owner)
    login_response1 = client.post('/api/auth/login/', {
        'email': 'owner@example.com',
        'password': 'testpass123'
    })

    if login_response1.status_code != 200:
        print("FAIL: Owner login failed")
        return False

    # Access booking as owner
    response1 = client.get(f'/api/bookings/{booking.id}/')

    if response1.status_code == 200:
        response_data1 = json.loads(response1.content.decode('utf-8'))
        if response_data1.get('address') == 'Owner Address 123':
            print("PASS: Owner can access their booking with decrypted data")
        else:
            print("FAIL: Owner booking data incorrect")
            return False
    else:
        print(f"FAIL: Owner access failed. Status: {response1.status_code}")
        return False

    # Login as user2 (not owner)
    login_response2 = client.post('/api/auth/login/', {
        'email': 'other@example.com',
        'password': 'testpass123'
    })

    if login_response2.status_code != 200:
        print("FAIL: Other user login failed")
        return False

    # Try to access booking as user2
    response2 = client.get(f'/api/bookings/{booking.id}/')

    if response2.status_code == 404:
        print("PASS: Non-owner correctly gets 404 for other user's booking")
        return True
    else:
        print(f"FAIL: Expected 404 for non-owner, got {response2.status_code}")
        return False


def run_all_tests():
    """Run all booking API tests"""
    print("Running Booking API Tests...")

    success = True

    # Test 1: Booking creation with encryption
    success &= test_booking_creation_api()

    # Test 2: Unauthorized access
    success &= test_unauthorized_booking_creation()

    # Test 3: Owner-only access to booking details
    success &= test_booking_detail_owner_access()

    if success:
        print("\nAll booking API tests passed!")
        return True
    else:
        print("\nSome booking API tests failed!")
        return False


if __name__ == '__main__':
    success = run_all_tests()
    if not success:
        sys.exit(1)
