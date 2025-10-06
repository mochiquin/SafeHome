#!/usr/bin/env python3
"""
Simple test script for encryption utility (without Django)
"""
import os
import sys
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# Add current directory to path so we can import crypto
sys.path.insert(0, os.path.dirname(__file__))

from core.crypto import enc, dec


def test_encryption_roundtrip():
    """Test that encryption and decryption returns the original string"""
    print("Testing encryption round-trip functionality...")

    # Test data
    test_cases = [
        "Hello, World!",
        "Sensitive user data: address, phone number",
        "Payment information: credit card details",
        "User authentication token",
        "123456789",
        "special_chars_!@#$%^&*()",
        "unicode_test_zhongwen",
        "",  # Empty string
    ]

    success_count = 0

    for i, test_data in enumerate(test_cases, 1):
        print(f"\nTest {i}: '{test_data[:50]}...'")

        try:
            # Encrypt the data
            encrypted = enc(test_data)
            print(f"  Encrypted: {encrypted[:50]}...")

            # Decrypt the data
            decrypted = dec(encrypted)
            print(f"  Decrypted: '{decrypted}'")

            # Verify round-trip
            if decrypted == test_data:
                print("  PASS: Round-trip successful")
                success_count += 1
            else:
                print(f"  FAIL: Expected '{test_data}', got '{decrypted}'")

        except Exception as e:
            print(f"  ERROR: {str(e)}")

    print("\n" + "="*50)
    print(f"Test Results: {success_count}/{len(test_cases)} passed")

    if success_count == len(test_cases):
        print("All encryption tests passed!")
        return True
    else:
        print("Some tests failed!")
        return False


def test_encryption_errors():
    """Test error handling in encryption functions"""
    print("\nTesting error handling...")

    # Test enc() with invalid input
    try:
        enc(123)  # Should raise TypeError
        print("FAIL: enc() should reject non-string input")
        return False
    except TypeError:
        print("PASS: enc() correctly rejects non-string input")

    # Test dec() with invalid input
    try:
        dec(123)  # Should raise TypeError
        print("FAIL: dec() should reject non-string input")
        return False
    except TypeError:
        print("PASS: dec() correctly rejects non-string input")

    # Test dec() with invalid encrypted data
    try:
        dec("invalid_encrypted_data")
        print("FAIL: dec() should reject invalid encrypted data")
        return False
    except ValueError:
        print("PASS: dec() correctly rejects invalid encrypted data")

    return True


def test_without_fernet_key():
    """Test behavior when FERNET_KEY is not set"""
    print("\nTesting without FERNET_KEY...")

    # Save original key
    original_key = os.environ.get('FERNET_KEY')

    # Remove FERNET_KEY
    if 'FERNET_KEY' in os.environ:
        del os.environ['FERNET_KEY']

    try:
        enc("test")
        print("FAIL: enc() should require FERNET_KEY")
        return False
    except ValueError as e:
        if "FERNET_KEY environment variable is required" in str(e):
            print("PASS: enc() correctly requires FERNET_KEY")
        else:
            print(f"FAIL: Wrong error message: {e}")
            return False
    finally:
        # Restore original key
        if original_key:
            os.environ['FERNET_KEY'] = original_key

    return True


if __name__ == '__main__':
    print("Testing SafeHome Encryption Utility...")

    success = True

    # Test 1: Round-trip encryption/decryption
    success &= test_encryption_roundtrip()

    # Test 2: Error handling
    success &= test_encryption_errors()

    # Test 3: FERNET_KEY requirement
    success &= test_without_fernet_key()

    if success:
        print("\nAll encryption utility tests passed!")
    else:
        print("\nSome tests failed!")
        sys.exit(1)
