"""
Tests for booking creation, field encryption and owner-only access.
"""
from datetime import timedelta

from django.utils import timezone

from bookings.models import Booking
from tests.conftest import encrypt_payload, make_booking

CREATE_URL = '/api/bookings/create/'
LIST_URL = '/api/bookings/my-bookings/'

ADDRESS = '456 Test Avenue, Adelaide SA 5000'
PHONE = '+61 411 222 333'


def booking_data(**overrides):
    data = {
        'service_type': 'plumbing',
        'budget': '150.00',
        'address': ADDRESS,
        'phone': PHONE,
        'city': 'Adelaide',
        'state': 'SA',
        'country': 'AU',
        'start_time': (timezone.now() + timedelta(days=2)).isoformat(),
        'duration_hours': 3,
        'notes': 'Leaking kitchen tap',
    }
    data.update(overrides)
    return data


class TestCreate:
    def test_stores_address_and_phone_encrypted(self, customer_client, customer):
        response = customer_client.post(CREATE_URL, booking_data(), format='json')

        assert response.status_code == 201
        booking = Booking.objects.get(user=customer)
        assert ADDRESS.encode() not in bytes(booking.address_enc)
        assert PHONE.encode() not in bytes(booking.phone_enc)
        assert booking.get_address() == ADDRESS
        assert booking.get_phone() == PHONE
        assert len(booking.confirmation_code) == 4

    def test_accepts_encrypted_payload(self, customer_client, customer):
        response = customer_client.post(CREATE_URL, encrypt_payload(booking_data()), format='json')

        assert response.status_code == 201
        assert Booking.objects.get(user=customer).get_address() == ADDRESS

    def test_requires_auth(self, api_client):
        response = api_client.post(CREATE_URL, booking_data(), format='json')

        assert response.status_code == 401
        assert not Booking.objects.exists()

    def test_rejects_start_time_in_the_past(self, customer_client):
        past = (timezone.now() - timedelta(days=1)).isoformat()

        response = customer_client.post(CREATE_URL, booking_data(start_time=past), format='json')

        assert response.status_code == 400
        assert not Booking.objects.exists()

    def test_requires_address_and_phone(self, customer_client):
        data = booking_data()
        del data['address'], data['phone']

        response = customer_client.post(CREATE_URL, data, format='json')

        assert response.status_code == 400


class TestAccess:
    def test_owner_sees_decrypted_details(self, customer_client, booking):
        response = customer_client.get(f'/api/bookings/{booking.id}/')

        assert response.status_code == 200
        assert response.data['data']['address'] == booking.get_address()
        assert response.data['data']['phone'] == booking.get_phone()

    def test_other_user_gets_404(self, other_client, booking):
        response = other_client.get(f'/api/bookings/{booking.id}/')

        assert response.status_code == 404

    def test_list_only_contains_own_bookings(self, customer_client, booking, other_customer):
        make_booking(other_customer)

        response = customer_client.get(LIST_URL)

        assert response.status_code == 200
        ids = [item['id'] for item in response.data['data']]
        assert ids == [str(booking.id)]
