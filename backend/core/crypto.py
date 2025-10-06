"""
Encryption utility using Fernet symmetric encryption
"""
import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


def _derive_key(key_string: str) -> bytes:
    """
    Derive a 32-byte key from the provided key string using PBKDF2
    """
    # Use a fixed salt for consistent key derivation
    salt = b"safehome_salt_2024"

    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )

    key = base64.urlsafe_b64encode(kdf.derive(key_string.encode()))
    return key


def _get_fernet() -> Fernet:
    """
    Get or create a Fernet instance using the FERNET_KEY environment variable
    """
    fernet_key = os.environ.get('FERNET_KEY')
    if not fernet_key:
        raise ValueError("FERNET_KEY environment variable is required")

    # Derive a proper 32-byte key from the provided key string
    key_bytes = _derive_key(fernet_key)

    return Fernet(key_bytes)


def enc(data: str) -> str:
    """
    Encrypt a string using Fernet symmetric encryption

    Args:
        data: The string data to encrypt

    Returns:
        Base64 encoded encrypted string

    Raises:
        ValueError: If FERNET_KEY is not set
    """
    if not isinstance(data, str):
        raise TypeError("Data must be a string")

    fernet = _get_fernet()
    encrypted_bytes = fernet.encrypt(data.encode('utf-8'))
    # Return as base64 string for easy storage/transmission
    return base64.urlsafe_b64encode(encrypted_bytes).decode('utf-8')


def dec(encrypted_data: str) -> str:
    """
    Decrypt a string using Fernet symmetric encryption

    Args:
        encrypted_data: Base64 encoded encrypted string

    Returns:
        The original decrypted string

    Raises:
        ValueError: If FERNET_KEY is not set or decryption fails
    """
    if not isinstance(encrypted_data, str):
        raise TypeError("Encrypted data must be a string")

    try:
        # Decode from base64
        encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode('utf-8'))

        fernet = _get_fernet()
        decrypted_bytes = fernet.decrypt(encrypted_bytes)
        return decrypted_bytes.decode('utf-8')
    except Exception as e:
        raise ValueError(f"Decryption failed: {str(e)}")


# Export the functions
__all__ = ['enc', 'dec']
