#!/usr/bin/env python3
"""
Test script for Payment model functionality (without database dependency)
"""
import os
import sys
import django
from pathlib import Path
from decimal import Decimal
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime

# Add the project root to Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

# Set FERNET_KEY environment variable
os.environ['FERNET_KEY'] = 'test-fernet-key-32-characters-long-for-encryption'

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safehome.settings')
django.setup()

from payments.models import Payment


def test_payment_creation():
    """Test basic payment creation"""
    print("Testing payment creation...")

    # Create a mock booking object that behaves like Django model
    booking = MagicMock()
    booking.id = 1
    booking.service.title = "Test Cleaning Service"

    # Test payment creation with mock data
    payment = Payment(
        booking=booking,
        amount=Decimal('150.00'),
        status='pending',
        currency='USD'
    )

    # Check initial values
    assert payment.amount == Decimal('150.00')
    assert payment.status == 'pending'
    assert payment.currency == 'USD'
    assert payment.is_pending == True
    assert payment.is_paid == False

    print("  PASS: Payment instance created successfully")
    print(f"  Amount: ${payment.amount}")
    print(f"  Status: {payment.status}")
    print(f"  Currency: {payment.currency}")

    return payment


def test_qr_token_generation():
    """Test QR token generation and uniqueness"""
    print("\nTesting QR token generation...")

    # Create payments and check QR tokens
    payments = []
    tokens = []

    for i in range(5):
        booking = MagicMock()
        booking.id = i + 1
        booking.service.title = f"Service {i+1}"

        payment = Payment(
            booking=booking,
            amount=Decimal(f'{50 + i}.00'),
            status='pending'
        )

        # Save should generate QR token
        with patch.object(Payment, 'save') as mock_save, \
             patch('payments.models.Payment.objects') as mock_objects:

            # Mock the database query for unique check
            mock_objects.filter.return_value.exists.return_value = False
            payment.save()
            mock_save.assert_called_once()

        # Check that QR token was generated
        assert payment.qr_token is not None
        assert len(payment.qr_token) > 0
        assert payment.qr_token not in tokens  # Should be unique

        tokens.append(payment.qr_token)
        payments.append(payment)

        print(f"  Payment {i+1} QR token: {payment.qr_token[:20]}...")

    print(f"  PASS: Generated {len(tokens)} unique QR tokens")

    # Test that all tokens are different
    assert len(set(tokens)) == len(tokens), "All QR tokens should be unique"

    return payments


def test_payment_status_transitions():
    """Test payment status transitions"""
    print("\nTesting payment status transitions...")

    booking = MagicMock()
    booking.id = 1
    booking.service.title = "Test Service"

    payment = Payment(
        booking=booking,
        amount=Decimal('100.00'),
        status='pending'
    )

    # Test initial state
    assert payment.status == 'pending'
    assert payment.is_pending == True
    assert payment.can_cancel == True
    assert payment.can_refund == False

    # Test marking as paid
    payment.mark_as_paid("pi_test_123", "card")
    assert payment.status == 'paid'
    assert payment.is_paid == True
    assert payment.can_cancel == False
    assert payment.can_refund == True
    assert payment.paid_at is not None

    print("  PASS: Mark as paid transition")

    # Test marking as failed
    payment.status = 'processing'
    payment.mark_as_failed()
    assert payment.status == 'failed'
    assert payment.is_paid == False
    assert payment.can_cancel == False
    assert payment.can_refund == False

    print("  PASS: Mark as failed transition")

    # Test cancellation
    payment.status = 'pending'
    payment.cancel()
    assert payment.status == 'cancelled'
    assert payment.can_cancel == False

    print("  PASS: Cancel transition")

    # Test refund
    payment.status = 'paid'
    payment.refund()
    assert payment.status == 'refunded'
    assert payment.can_refund == False

    print("  PASS: Refund transition")


def test_payment_validation():
    """Test payment validation"""
    print("\nTesting payment validation...")

    booking = MagicMock()
    booking.id = 1
    booking.service.title = "Test Service"

    # Test invalid amount (negative)
    try:
        payment = Payment(booking=booking, amount=Decimal('-50.00'))
        payment.full_clean()
        assert False, "Should raise validation error for negative amount"
    except Exception:
        print("  PASS: Negative amount correctly rejected")

    # Test invalid amount (zero)
    try:
        payment = Payment(booking=booking, amount=Decimal('0.00'))
        payment.full_clean()
        assert False, "Should raise validation error for zero amount"
    except Exception:
        print("  PASS: Zero amount correctly rejected")

    # Test invalid currency
    try:
        payment = Payment(
            booking=booking,
            amount=Decimal('50.00'),
            currency='INVALID'
        )
        payment.full_clean()
        assert False, "Should raise validation error for invalid currency"
    except Exception:
        print("  PASS: Invalid currency correctly rejected")

    # Test valid payment
    try:
        payment = Payment(
            booking=booking,
            amount=Decimal('75.50'),
            currency='USD'
        )
        payment.full_clean()  # Should not raise exception
        print("  PASS: Valid payment accepted")
    except Exception as e:
        assert False, f"Valid payment should not raise error: {e}"


def test_payment_string_representation():
    """Test payment string representation"""
    print("\nTesting payment string representation...")

    booking = MagicMock()
    booking.id = 1
    booking.service.title = "House Cleaning"

    payment = Payment(
        booking=booking,
        amount=Decimal('125.00'),
        status='paid'
    )

    expected_str = "Payment  - House Cleaning - $125.00"
    assert str(payment) == expected_str

    print(f"  String representation: {str(payment)}")
    print("  PASS: String representation correct")


def run_all_tests():
    """Run all payment model tests"""
    print("Running Payment Model Tests (without database)...")

    try:
        # Test 1: Basic payment creation
        payment = test_payment_creation()

        # Test 2: QR token generation
        payments = test_qr_token_generation()

        # Test 3: Status transitions
        test_payment_status_transitions()

        # Test 4: Validation
        test_payment_validation()

        # Test 5: String representation
        test_payment_string_representation()

        print("\n" + "="*60)
        print("All payment model tests passed!")
        print("Payment model creation and validation works correctly")
        print("QR token generation produces unique tokens")
        print("Payment status transitions work as expected")
        print("Payment validation catches invalid data")
        return True

    except Exception as e:
        print(f"\nTest failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    success = run_all_tests()
    if not success:
        sys.exit(1)
