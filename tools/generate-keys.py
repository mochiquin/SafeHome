#!/usr/bin/env python3
"""
Key Generation Script for SafeHome Project

This script generates secure random keys for:
- DJANGO_SECRET_KEY: Django's secret key for session encryption
- FERNET_KEY: Encryption key for sensitive data (address, phone)
- JWT_SIGNING_KEY: Key for JWT token signing

Usage:
    python tools/generate-keys.py

Output will be copied to clipboard and displayed in terminal.
"""

import secrets
import os
import base64
import subprocess
import sys


def generate_django_secret_key():
    """Generate Django Secret Key (50 characters)"""
    return secrets.token_urlsafe(50)


def generate_fernet_key():
    """Generate Fernet Key (32 bytes, Base64 encoded)"""
    return base64.urlsafe_b64encode(os.urandom(32)).decode()


def generate_jwt_signing_key():
    """Generate JWT Signing Key (32 bytes, Base64 encoded)"""
    return base64.urlsafe_b64encode(os.urandom(32)).decode()


def copy_to_clipboard(text):
    """Copy text to clipboard (Windows)"""
    try:
        subprocess.run(['clip'], input=text.encode('utf-8'), check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def main():
    print("SafeHome Key Generation Script")
    print("=" * 50)

    # Generate keys
    django_key = generate_django_secret_key()
    fernet_key = generate_fernet_key()
    jwt_key = generate_jwt_signing_key()

    print("\nKeys generated successfully!\n")

    # Display keys
    keys = {
        "DJANGO_SECRET_KEY": django_key,
        "FERNET_KEY": fernet_key,
        "JWT_SIGNING_KEY": jwt_key
    }

    for key_name, key_value in keys.items():
        print(f"{key_name}={key_value}")

    # Try to copy to clipboard
    all_keys_text = "\n".join([f"{k}={v}" for k, v in keys.items()])
    if copy_to_clipboard(all_keys_text):
        print("\nAll keys have been copied to clipboard!")
        print("You can now paste them into your .env file.")
    else:
        print("\nCould not copy to clipboard. Please manually copy the keys above.")
        print("Select all key lines and copy them to your .env file.")

    print("\n" + "=" * 50)
    print("Next steps:")
    print("1. Create compose/.env file (copy from compose/.env.example)")
    print("2. Replace the placeholder values with these generated keys")
    print("3. Add your other environment variables (Stripe keys, etc.)")
    print("\nRemember to keep these keys secure and never commit them to version control!")


if __name__ == "__main__":
    main()
