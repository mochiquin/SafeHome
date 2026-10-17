"""
Tests for registration, login, profile and logout (JWT in HttpOnly cookies).
"""
import pytest
from django.contrib.auth import get_user_model

from accounts.models import ConsentLog
from tests.conftest import PASSWORD, encrypt_payload, login, make_user

User = get_user_model()

REGISTER_URL = '/api/auth/register/'
LOGIN_URL = '/api/auth/login/'
ME_URL = '/api/auth/me/'
LOGOUT_URL = '/api/auth/logout/'


def registration_data(**overrides):
    data = {
        'email': 'new@example.com',
        'username': 'newuser',
        'first_name': 'New',
        'last_name': 'User',
        'password': PASSWORD,
        'password_confirm': PASSWORD,
        'consent': True,
        'role': 'customer',
        'city': 'Adelaide',
        'vaccinated': True,
    }
    data.update(overrides)
    return data


class TestRegister:
    def test_creates_user_logs_consent_and_sets_cookies(self, api_client):
        response = api_client.post(REGISTER_URL, registration_data(), format='json')

        assert response.status_code == 201
        user = User.objects.get(email='new@example.com')
        assert user.check_password(PASSWORD)
        assert ConsentLog.objects.filter(user=user).exists()
        assert response.cookies['access_token']['httponly']
        assert response.cookies['refresh_token']['httponly']

    def test_accepts_encrypted_payload(self, api_client):
        response = api_client.post(REGISTER_URL, encrypt_payload(registration_data()), format='json')

        assert response.status_code == 201
        assert User.objects.filter(email='new@example.com').exists()

    def test_rejects_tampered_encrypted_payload(self, api_client):
        body = encrypt_payload(registration_data())
        body['payload'] = body['payload'][:-4] + '0000'

        response = api_client.post(REGISTER_URL, body, format='json')

        assert response.status_code == 400
        assert not User.objects.exists()

    @pytest.mark.parametrize('overrides, field', [
        ({'password_confirm': 'different123'}, 'password_confirm'),
        ({'consent': False}, 'consent'),
        ({'role': 'provider'}, 'provider_id'),
        ({'password': 'short', 'password_confirm': 'short'}, 'password'),
    ])
    def test_invalid_data_returns_400(self, api_client, overrides, field):
        response = api_client.post(REGISTER_URL, registration_data(**overrides), format='json')

        assert response.status_code == 400
        assert field in response.data['data']
        assert not User.objects.exists()

    def test_duplicate_email_returns_400(self, api_client, customer):
        response = api_client.post(
            REGISTER_URL, registration_data(email=customer.email), format='json'
        )

        assert response.status_code == 400
        assert 'email' in response.data['data']


class TestLogin:
    def test_valid_credentials_set_httponly_cookies(self, api_client, customer):
        response = api_client.post(
            LOGIN_URL, {'email': customer.email, 'password': PASSWORD}, format='json'
        )

        assert response.status_code == 200
        assert response.cookies['access_token'].value
        assert response.cookies['access_token']['httponly']
        assert response.data['data']['user']['email'] == customer.email

    def test_wrong_password_returns_401(self, api_client, customer):
        response = api_client.post(
            LOGIN_URL, {'email': customer.email, 'password': 'wrong-password'}, format='json'
        )

        assert response.status_code == 401

    def test_unknown_email_returns_401(self, api_client):
        response = api_client.post(
            LOGIN_URL, {'email': 'nobody@example.com', 'password': PASSWORD}, format='json'
        )

        assert response.status_code == 401

    def test_role_mismatch_returns_403(self, api_client, customer):
        response = api_client.post(
            LOGIN_URL,
            {'email': customer.email, 'password': PASSWORD, 'role': 'provider'},
            format='json',
        )

        assert response.status_code == 403


class TestProfileAndLogout:
    def test_profile_requires_auth(self, api_client):
        assert api_client.get(ME_URL).status_code == 401

    def test_profile_with_cookie(self, customer_client, customer):
        response = customer_client.get(ME_URL)

        assert response.status_code == 200
        assert response.data['data']['email'] == customer.email

    def test_logout_clears_cookies(self, api_client):
        user = make_user('logout@example.com')
        login(api_client, user)

        response = api_client.post(LOGOUT_URL)

        assert response.status_code == 200
        assert response.cookies['access_token'].value == ''
        assert api_client.get(ME_URL).status_code == 401
