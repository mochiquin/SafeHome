"""
Settings for the automated test suite.

Uses an in-memory SQLite database and dummy secrets so the tests run anywhere
(locally or in CI) without MySQL, Stripe or a compose/.env file.
"""
import os

_TEST_ENV = {
    'DJANGO_SECRET_KEY': 'test-secret-key-not-for-production',
    'DJANGO_DEBUG': 'False',
    'DJANGO_ALLOWED_HOSTS': '',
    'DJANGO_TIME_ZONE': 'UTC',
    'DJANGO_USE_TZ': 'True',
    'DJANGO_CORS_ALLOWED_ORIGINS': '',
    'FERNET_KEY': 'test-fernet-key-for-the-test-suite',
    'STRIPE_PUBLISHABLE_KEY': 'pk_test_dummy',
    'STRIPE_SECRET_KEY': 'sk_test_dummy',
    'STRIPE_WEBHOOK_SECRET': 'whsec_dummy',
    'FRONTEND_URL': 'http://localhost:3000',
}
for _key, _value in _TEST_ENV.items():
    os.environ.setdefault(_key, _value)

from .settings import *  # noqa: E402,F401,F403

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Fast password hashing keeps the suite quick
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
