"""
Shared fixtures for the SafeHome test suite.
"""
import json
import os
from datetime import timedelta
from decimal import Decimal

import pytest
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from bookings.models import Booking

User = get_user_model()

PASSWORD = 'testpass123'


@pytest.fixture(autouse=True)
def _enable_db(db):
    """Give every test database access."""


@pytest.fixture
def api_client():
    return APIClient()


def make_user(email, role='customer', **extra):
    return User.objects.create_user(
        email=email,
        username=email.split('@')[0],
        password=PASSWORD,
        first_name='Test',
        last_name='User',
        role=role,
        city='Adelaide',
        **extra,
    )


@pytest.fixture
def customer():
    return make_user('customer@example.com')


@pytest.fixture
def other_customer():
    return make_user('other@example.com')


def login(client, user):
    """Authenticate a client the same way the app does: an HttpOnly access_token cookie."""
    client.cookies['access_token'] = str(RefreshToken.for_user(user).access_token)
    return client


@pytest.fixture
def customer_client(api_client, customer):
    return login(api_client, customer)


@pytest.fixture
def other_client(other_customer):
    return login(APIClient(), other_customer)


def make_booking(user, **overrides):
    fields = {
        'user': user,
        'service_type': 'cleaning',
        'budget': Decimal('120.00'),
        'city': 'Adelaide',
        'state': 'SA',
        'country': 'AU',
        'start_time': timezone.now() + timedelta(days=1),
        'duration_hours': 2,
    }
    fields.update(overrides)
    booking = Booking(**fields)
    booking.set_address('1 King William St, Adelaide SA 5000')
    booking.set_phone('+61 400 000 000')
    booking.save()
    return booking


@pytest.fixture
def booking(customer):
    return make_booking(customer)


def encrypt_payload(data: dict) -> dict:
    """
    Encrypt a request body the way the frontend does (AES-GCM, "iv:ciphertext:tag" in hex),
    so tests exercise the EncryptedJSONParser end to end.
    """
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=b'safehome_salt_2024', iterations=100000)
    key = kdf.derive(os.environ['FERNET_KEY'].encode())
    iv = os.urandom(12)
    sealed = AESGCM(key).encrypt(iv, json.dumps(data).encode(), None)
    ciphertext, tag = sealed[:-16], sealed[-16:]
    return {'payload': f'{iv.hex()}:{ciphertext.hex()}:{tag.hex()}'}
