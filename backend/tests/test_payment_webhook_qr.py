#!/usr/bin/env python3
"""
Test script for payment webhook and QR functionality
"""
import os
import sys
import django
import json
from pathlib import Path
from unittest.mock import patch, MagicMock
from decimal import Decimal

# Add the project root to Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

# Set FERNET_KEY environment variable
os.environ['FERNET_KEY'] = 'test-fernet-key-32-characters-long-for-encryption'

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safehome.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from django.http import HttpRequest
from payments.views import stripe_webhook, payment_qr_data

User = get_user_model()


def test_webhook_logic():
    """Test webhook core logic"""
    print("Testing webhook core logic...")

    # Test webhook signature verification logic
    from payments.views import stripe_webhook

    # Test missing signature
    class TestRequest(HttpRequest):
        def __init__(self, body):
            super().__init__()
            self.method = 'POST'
            self._body = body.encode() if isinstance(body, str) else body
            self.META = {}

        @property
        def body(self):
            return self._body

    request = TestRequest('{"type": "test"}')
    response = stripe_webhook(request)

    if response.status_code == 400:
        print("PASS: Missing signature correctly rejected")
        return True
    else:
        print(f"FAIL: Expected 400 for missing signature, got {response.status_code}")
        return False


def test_qr_endpoint_logic():
    """Test QR endpoint logic"""
    print("\nTesting QR endpoint logic...")

    client = Client()

    # Create test user
    user = User.objects.create_user(
        email='qrtest@example.com',
        username='qrtest',
        password='testpass123'
    )

    client.login(email='qrtest@example.com', password='testpass123')

    # Mock payment
    with patch('payments.views.Payment') as mock_payment_class:
        mock_payment = MagicMock()
        mock_payment.id = 'payment_123'
        mock_payment.qr_token = 'test_qr_token_123'
        mock_payment.status = 'pending'
        mock_payment.amount = Decimal('75.00')
        mock_payment.currency = 'USD'
        mock_payment.booking.user = user

        mock_payment_class.objects.get.return_value = mock_payment

        # Test QR data access as owner
        response = client.get('/api/payments/payment_123/qr/')

        if response.status_code == 200:
            data = json.loads(response.content.decode('utf-8'))

            if (data.get('qr_token') == 'test_qr_token_123' and
                data.get('status') == 'pending' and
                data.get('amount') == '75.00' and
                data.get('currency') == 'USD'):

                print("PASS: QR endpoint returns correct data for owner")
                return True
            else:
                print("FAIL: QR endpoint data incorrect")
                return False
        else:
            print(f"FAIL: Expected 200, got {response.status_code}")
            return False


def test_qr_endpoint_unauthorized():
    """Test QR endpoint without authentication"""
    print("\nTesting QR endpoint without authentication...")

    client = Client()

    # Try to access QR data without login
    response = client.get('/api/payments/payment_123/qr/')

    if response.status_code == 401:
        print("PASS: Unauthorized QR access correctly rejected")
        return True
    else:
        print(f"FAIL: Expected 401, got {response.status_code}")
        return False


def test_qr_endpoint_non_owner_access():
    """Test QR endpoint non-owner access returns 404"""
    print("\nTesting QR endpoint non-owner access...")

    client = Client()

    # Create two users
    owner = User.objects.create_user(
        email='owner@example.com',
        username='owner',
        password='testpass123'
    )

    non_owner = User.objects.create_user(
        email='nonowner@example.com',
        username='nonowner',
        password='testpass123'
    )

    client.login(email='nonowner@example.com', password='testpass123')

    # Mock payment belonging to owner
    with patch('payments.views.Payment') as mock_payment_class:
        mock_payment = MagicMock()
        mock_payment.id = 'payment_123'
        mock_payment.booking.user = owner  # Belongs to owner, not non_owner

        mock_payment_class.objects.get.return_value = mock_payment

        # Test QR data access as non-owner
        response = client.get('/api/payments/payment_123/qr/')

        if response.status_code == 404:
            error_data = json.loads(response.content.decode('utf-8'))
            if 'Payment not found' in error_data.get('error', ''):
                print("PASS: Non-owner correctly gets 404")
                return True
            else:
                print("FAIL: Wrong error message for non-owner access")
                return False
        else:
            print(f"FAIL: Expected 404, got {response.status_code}")
            return False


def run_all_tests():
    """Run all payment webhook and QR tests"""
    print("Running Payment Webhook and QR Tests...")

    success = True

    # Test 1: Webhook signature verification
    success &= test_webhook_logic()

    # Test 2: QR endpoint owner access
    success &= test_qr_endpoint_logic()

    # Test 3: QR endpoint non-owner access
    success &= test_qr_endpoint_non_owner_access()

    # Test 4: QR endpoint unauthorized access
    success &= test_qr_endpoint_unauthorized()

    if success:
        print("\nAll payment webhook and QR tests passed!")
        print("✅ Webhook signature verification works")
        print("✅ QR endpoint access control works correctly")
        print("✅ Authentication requirements enforced")
        return True
    else:
        print("\nSome payment webhook and QR tests failed!")
        return False


if __name__ == '__main__':
    success = run_all_tests()
    if not success:
        sys.exit(1)
