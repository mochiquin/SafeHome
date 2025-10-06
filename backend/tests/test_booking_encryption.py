#!/usr/bin/env python3
"""
Simple test for Booking model encryption without database dependency
"""
import os
import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

# Set FERNET_KEY environment variable
os.environ['FERNET_KEY'] = 'test-fernet-key-32-characters-long-for-encryption'

# Import crypto functions
from core.crypto import enc, dec


class MockBooking:
    """Mock Booking class to test encryption without database"""

    def __init__(self):
        self.address_enc = None
        self.phone_enc = None

    def set_address(self, address: str):
        """Encrypt and set the address"""
        self.address_enc = enc(address).encode('utf-8')

    def get_address(self) -> str:
        """Decrypt and return the address"""
        if self.address_enc:
            encrypted_str = self.address_enc.decode('utf-8')
            return dec(encrypted_str)
        return ""

    def set_phone(self, phone: str):
        """Encrypt and set the phone number"""
        self.phone_enc = enc(phone).encode('utf-8')

    def get_phone(self) -> str:
        """Decrypt and return the phone number"""
        if self.phone_enc:
            encrypted_str = self.phone_enc.decode('utf-8')
            return dec(encrypted_str)
        return ""

    # Property methods for easier access
    address = property(get_address, set_address)
    phone = property(get_phone, set_phone)


def test_booking_encryption():
    """Test that address and phone are properly encrypted"""
    print("Testing Booking model encryption functionality...")

    # Create mock booking
    booking = MockBooking()

    # Test data
    test_address = "123 Main Street, Anytown, ST 12345"
    test_phone = "+1-555-123-4567"

    print(f"Original address: {test_address}")
    print(f"Original phone: {test_phone}")

    # Set encrypted data
    booking.address = test_address
    booking.phone = test_phone

    # Check that encrypted data in memory is not readable
    address_encrypted = booking.address_enc
    phone_encrypted = booking.phone_enc

    print(f"Encrypted address (first 50 chars): {address_encrypted[:50]}...")
    print(f"Encrypted phone (first 50 chars): {phone_encrypted[:50]}...")

    # Verify that encrypted data doesn't contain original plaintext
    address_str = address_encrypted.decode('utf-8', errors='ignore')
    phone_str = phone_encrypted.decode('utf-8', errors='ignore')

    # The encrypted data should not contain the original address or phone
    assert test_address not in address_str, "Encrypted address should not contain plaintext"
    assert test_phone not in phone_str, "Encrypted phone should not contain plaintext"

    print("PASS: Encrypted data does not contain plaintext")

    # Test that decryption works correctly
    decrypted_address = booking.address
    decrypted_phone = booking.phone

    print(f"Decrypted address: {decrypted_address}")
    print(f"Decrypted phone: {decrypted_phone}")

    # Verify round-trip encryption/decryption
    assert decrypted_address == test_address, f"Address decryption failed: {decrypted_address} != {test_address}"
    assert decrypted_phone == test_phone, f"Phone decryption failed: {decrypted_phone} != {test_phone}"

    print("PASS: Round-trip encryption/decryption successful")


def test_booking_ciphertext_not_readable():
    """Test that saved ciphertext is not human readable"""
    print("\nTesting that ciphertext is not readable...")

    booking = MockBooking()

    # Test with various sensitive data
    sensitive_data = [
        "123 Main Street, Springfield, IL 62701",
        "+1-555-123-4567",
        "user@personal-email.com",
        "Credit Card: 4532-1234-5678-9012",
        "SSN: 123-45-6789"
    ]

    for data in sensitive_data:
        booking.address = data
        encrypted = booking.address_enc.decode('utf-8')

        # Check that encrypted data doesn't contain the original sensitive information
        print(f"Data: {data[:30]}...")

        # The key test: encrypted data should not contain the original plaintext
        # This is the most important security check
        assert data not in encrypted, f"Original data found in ciphertext for: {data[:30]}..."

    print("PASS: All ciphertext does not contain original sensitive data")


def test_multiple_encryption_rounds():
    """Test that multiple encryption rounds produce different ciphertexts"""
    print("\nTesting multiple encryption rounds...")

    booking = MockBooking()
    test_data = "Test data for multiple encryption"

    # Encrypt the same data multiple times
    ciphertexts = []
    for i in range(5):
        booking.address = test_data
        ciphertext = booking.address_enc.decode('utf-8')
        ciphertexts.append(ciphertext)

        # Each encryption should produce different ciphertext (due to IV)
        decrypted = booking.address
        assert decrypted == test_data, f"Round {i+1}: Decryption failed"

    # All ciphertexts should be different ( Fernet uses random IV)
    unique_ciphertexts = set(ciphertexts)
    assert len(unique_ciphertexts) == len(ciphertexts), "All ciphertexts should be unique"

    print("PASS: Multiple encryption rounds produce different ciphertexts")


def run_all_tests():
    """Run all encryption tests"""
    print("Running Booking Encryption Tests (without database)...")

    try:
        test_booking_encryption()
        test_booking_ciphertext_not_readable()
        test_multiple_encryption_rounds()

        print("\n" + "="*60)
        print("All booking encryption tests passed!")
        print("Sensitive data is properly encrypted and not readable in ciphertext")
        print("Round-trip encryption/decryption works correctly")
        print("Multiple encryption rounds produce unique ciphertexts")
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
