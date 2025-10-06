#!/usr/bin/env python3
"""
Test script for Stripe checkout functionality
"""
import os
import sys
import django
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock
from decimal import Decimal

# Add the project root to Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safehome.settings')
django.setup()

import json
from django.test import Client
from django.contrib.auth import get_user_model
from payments.views import create_stripe_checkout_session, stripe_config

User = get_user_model()


def test_stripe_config_endpoint():
    """Test Stripe config endpoint"""
    print("Testing Stripe config endpoint...")

    client = Client()

    # Create and login user
    user = User.objects.create_user(
        email='stripeconfig@example.com',
        username='stripeconfig',
        password='testpass123'
    )

    client.login(email='stripeconfig@example.com', password='testpass123')

    # Mock Stripe config
    with patch('payments.views.StripeConfig.get_publishable_key') as mock_key:
        mock_key.return_value = 'pk_test_mock_key_12345'

        response = client.get('/api/payments/stripe/config/')

        if response.status_code == 200:
            data = json.loads(response.content.decode('utf-8'))
            if 'publishableKey' in data:
                print("PASS: Stripe config returned publishable key")
                return True
            else:
                print("FAIL: Stripe config missing publishableKey")
                return False
        else:
            print(f"FAIL: Expected 200, got {response.status_code}")
            return False


def test_stripe_checkout_creation():
    """Test Stripe checkout session creation"""
    print("\nTesting Stripe checkout creation...")

    client = Client()

    # Create and login user
    user = User.objects.create_user(
        email='stripeco@example.com',
        username='stripeco',
        password='testpass123'
    )

    client.login(email='stripeco@example.com', password='testpass123')

    # Mock Stripe API
    mock_session = MagicMock()
    mock_session.url = 'https://checkout.stripe.com/pay/cs_test_mock_session'
    mock_session.id = 'cs_test_mock_session_12345'

    with patch('payments.views.StripeConfig.get_secret_key') as mock_secret, \
         patch('stripe.checkout.Session.create') as mock_create:

        mock_secret.return_value = 'sk_test_mock_secret_12345'
        mock_create.return_value = mock_session

        # Test checkout creation
        checkout_data = {
            'booking_id': 'booking_123',
            'amount': 2500,  # $25.00 in cents
            'currency': 'usd'
        }

        response = client.post(
            '/api/payments/stripe/checkout/',
            data=json.dumps(checkout_data),
            content_type='application/json'
        )

        if response.status_code == 200:
            data = json.loads(response.content.decode('utf-8'))

            if 'checkout_url' in data and 'session_id' in data:
                print("PASS: Stripe checkout session created successfully")
                print(f"  Checkout URL: {data['checkout_url']}")
                print(f"  Session ID: {data['session_id']}")

                # Verify Stripe API was called correctly
                mock_create.assert_called_once()
                call_args = mock_create.call_args[1]

                # Check that the session was created with correct parameters
                assert 'payment_method_types' in call_args
                assert 'line_items' in call_args
                assert 'mode' in call_args
                assert 'success_url' in call_args
                assert 'cancel_url' in call_args
                assert 'metadata' in call_args

                print("PASS: Stripe API called with correct parameters")
                return True
            else:
                print("FAIL: Response missing checkout_url or session_id")
                return False
        else:
            print(f"FAIL: Expected 200, got {response.status_code}")
            error_data = json.loads(response.content.decode('utf-8'))
            print(f"Error: {error_data}")
            return False


def test_stripe_checkout_missing_booking_id():
    """Test Stripe checkout with missing booking_id"""
    print("\nTesting Stripe checkout with missing booking_id...")

    client = Client()

    # Create and login user
    user = User.objects.create_user(
        email='striperror@example.com',
        username='striperror',
        password='testpass123'
    )

    client.login(email='striperror@example.com', password='testpass123')

    # Test without booking_id
    response = client.post(
        '/api/payments/stripe/checkout/',
        data=json.dumps({'amount': 1000}),
        content_type='application/json'
    )

    if response.status_code == 400:
        error_data = json.loads(response.content.decode('utf-8'))
        if 'booking_id is required' in error_data.get('error', ''):
            print("PASS: Missing booking_id correctly rejected")
            return True
        else:
            print("FAIL: Wrong error message for missing booking_id")
            return False
    else:
        print(f"FAIL: Expected 400, got {response.status_code}")
        return False


def test_stripe_checkout_unauthorized():
    """Test Stripe checkout without authentication"""
    print("\nTesting Stripe checkout without authentication...")

    client = Client()

    # Try to create checkout without login
    response = client.post(
        '/api/payments/stripe/checkout/',
        data=json.dumps({'booking_id': 'test'}),
        content_type='application/json'
    )

    if response.status_code == 401:
        print("PASS: Unauthorized checkout correctly rejected")
        return True
    else:
        print(f"FAIL: Expected 401, got {response.status_code}")
        return False


def test_stripe_checkout_missing_stripe_keys():
    """Test Stripe checkout with missing API keys"""
    print("\nTesting Stripe checkout with missing API keys...")

    client = Client()

    # Create and login user
    user = User.objects.create_user(
        email='stripemissing@example.com',
        username='stripemissing',
        password='testpass123'
    )

    client.login(email='stripemissing@example.com', password='testpass123')

    # Mock missing Stripe secret key
    with patch('payments.views.StripeConfig.get_secret_key') as mock_secret:
        mock_secret.return_value = None

        response = client.post(
            '/api/payments/stripe/checkout/',
            data=json.dumps({'booking_id': 'test'}),
            content_type='application/json'
        )

        if response.status_code == 500:
            error_data = json.loads(response.content.decode('utf-8'))
            if 'Stripe secret key not configured' in error_data.get('error', ''):
                print("PASS: Missing Stripe secret key correctly handled")
                return True
            else:
                print("FAIL: Wrong error message for missing Stripe key")
                return False
        else:
            print(f"FAIL: Expected 500, got {response.status_code}")
            return False


def run_all_tests():
    """Run all Stripe checkout tests"""
    print("Running Stripe Checkout Tests...")

    success = True

    # Test 1: Stripe config endpoint
    success &= test_stripe_config_endpoint()

    # Test 2: Stripe checkout creation
    success &= test_stripe_checkout_creation()

    # Test 3: Missing booking_id validation
    success &= test_stripe_checkout_missing_booking_id()

    # Test 4: Unauthorized access
    success &= test_stripe_checkout_unauthorized()

    # Test 5: Missing Stripe keys
    success &= test_stripe_checkout_missing_stripe_keys()

    if success:
        print("\nAll Stripe checkout tests passed!")
        print("✅ Stripe checkout API works correctly")
        print("✅ Authentication and validation work properly")
        print("✅ Error handling for missing configuration")
        return True
    else:
        print("\nSome Stripe checkout tests failed!")
        return False


if __name__ == '__main__':
    success = run_all_tests()
    if not success:
        sys.exit(1)
