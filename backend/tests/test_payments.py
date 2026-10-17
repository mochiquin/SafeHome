"""
Tests for the Payment model, Stripe checkout, the Stripe webhook and QR payment data.
Stripe is mocked; no network calls are made.
"""
from decimal import Decimal
from unittest.mock import MagicMock, patch

import pytest
import stripe
from django.core.exceptions import ValidationError

from payments.models import Payment
from tests.conftest import make_booking

CHECKOUT_URL = '/api/payments/stripe/checkout/'
WEBHOOK_URL = '/api/payments/stripe/webhook/'
CONFIG_URL = '/api/payments/stripe/config/'


@pytest.fixture
def payment(booking):
    return Payment.objects.create(booking=booking, amount=Decimal('120.00'))


class TestPaymentModel:
    def test_save_generates_unique_qr_tokens(self, customer):
        first = Payment.objects.create(booking=make_booking(customer), amount=Decimal('10.00'))
        second = Payment.objects.create(booking=make_booking(customer), amount=Decimal('10.00'))

        assert first.qr_token and second.qr_token
        assert first.qr_token != second.qr_token

    @pytest.mark.parametrize('amount', [Decimal('-50.00'), Decimal('0.00')])
    def test_rejects_non_positive_amount(self, booking, amount):
        with pytest.raises(ValidationError):
            Payment.objects.create(booking=booking, amount=amount)

    def test_rejects_invalid_currency(self, booking):
        with pytest.raises(ValidationError):
            Payment.objects.create(booking=booking, amount=Decimal('50.00'), currency='DOLLARS')

    def test_one_payment_per_booking(self, payment):
        with pytest.raises(ValidationError):
            Payment.objects.create(booking=payment.booking, amount=Decimal('5.00'))

    def test_str_describes_payment(self, payment):
        text = str(payment)
        assert 'Home Cleaning' in text
        assert '120.00' in text

    def test_mark_as_paid(self, payment):
        payment.mark_as_paid(stripe_payment_intent_id='pi_123', payment_method='card')
        payment.refresh_from_db()

        assert payment.is_paid
        assert payment.paid_at is not None
        assert payment.stripe_payment_intent_id == 'pi_123'

    def test_cancel_only_from_pending_or_processing(self, payment):
        payment.mark_as_paid()
        payment.cancel()
        assert payment.status == 'paid'

    def test_refund_only_from_paid(self, payment):
        payment.refund()
        assert payment.status == 'pending'

        payment.mark_as_paid()
        payment.refund()
        assert payment.status == 'refunded'


class TestCheckout:
    def _fake_session(self):
        session = MagicMock()
        session.id = 'cs_test_123'
        session.url = 'https://checkout.stripe.com/pay/cs_test_123'
        return session

    def test_creates_session_and_pending_payment(self, customer_client, booking):
        with patch('payments.views.stripe.checkout.Session.create', return_value=self._fake_session()) as create:
            response = customer_client.post(CHECKOUT_URL, {'booking_id': str(booking.id)}, format='json')

        assert response.status_code == 200
        assert response.data['data']['checkout_url'].startswith('https://checkout.stripe.com/')
        line_item = create.call_args.kwargs['line_items'][0]
        assert line_item['price_data']['unit_amount'] == 12000
        payment = Payment.objects.get(booking=booking)
        assert payment.status == 'pending'
        assert payment.stripe_session_id == 'cs_test_123'

    def test_uses_provider_quote_over_budget(self, customer_client, customer):
        booking = make_booking(customer, provider_quote=Decimal('95.50'))

        with patch('payments.views.stripe.checkout.Session.create', return_value=self._fake_session()) as create:
            customer_client.post(CHECKOUT_URL, {'booking_id': str(booking.id)}, format='json')

        assert create.call_args.kwargs['line_items'][0]['price_data']['unit_amount'] == 9550

    def test_requires_booking_id(self, customer_client):
        response = customer_client.post(CHECKOUT_URL, {}, format='json')

        assert response.status_code == 400

    def test_booking_without_price_is_rejected(self, customer_client, customer):
        booking = make_booking(customer, budget=None)

        response = customer_client.post(CHECKOUT_URL, {'booking_id': str(booking.id)}, format='json')

        assert response.status_code == 400

    def test_requires_auth(self, api_client, booking):
        response = api_client.post(CHECKOUT_URL, {'booking_id': str(booking.id)}, format='json')

        assert response.status_code == 401

    def test_only_booking_owner_can_pay(self, other_client, booking):
        with patch('payments.views.stripe.checkout.Session.create', return_value=self._fake_session()) as create:
            response = other_client.post(CHECKOUT_URL, {'booking_id': str(booking.id)}, format='json')

        assert response.status_code == 403
        create.assert_not_called()
        assert not Payment.objects.exists()

    def test_config_returns_publishable_key(self, customer_client):
        response = customer_client.get(CONFIG_URL)

        assert response.status_code == 200
        assert response.data['data']['publishableKey'] == 'pk_test_dummy'


class TestWebhook:
    def _event(self, booking):
        return stripe.Event.construct_from({
            'id': 'evt_test',
            'type': 'checkout.session.completed',
            'data': {'object': {
                'id': 'cs_test_123',
                'object': 'checkout.session',
                'payment_intent': 'pi_test_123',
                'metadata': {'booking_id': str(booking.id)},
            }},
        }, 'sk_test_dummy')

    def test_missing_signature_is_rejected(self, api_client):
        response = api_client.post(WEBHOOK_URL, data='{}', content_type='application/json')

        assert response.status_code == 400

    def test_invalid_signature_is_rejected(self, api_client):
        response = api_client.post(
            WEBHOOK_URL, data='{}', content_type='application/json', HTTP_STRIPE_SIGNATURE='t=1,v1=bad'
        )

        assert response.status_code == 400

    def test_completed_checkout_marks_payment_paid(self, api_client, payment):
        with patch('payments.views.stripe.Webhook.construct_event', return_value=self._event(payment.booking)):
            response = api_client.post(
                WEBHOOK_URL, data='{}', content_type='application/json', HTTP_STRIPE_SIGNATURE='t=1,v1=sig'
            )

        assert response.status_code == 200
        payment.refresh_from_db()
        assert payment.is_paid
        assert payment.stripe_payment_intent_id == 'pi_test_123'


class TestQrData:
    def test_owner_gets_qr_token(self, customer_client, payment):
        response = customer_client.get(f'/api/payments/{payment.id}/qr/')

        assert response.status_code == 200
        assert response.data['data']['qr_token'] == payment.qr_token

    def test_other_user_gets_404(self, other_client, payment):
        assert other_client.get(f'/api/payments/{payment.id}/qr/').status_code == 404

    def test_requires_auth(self, api_client, payment):
        assert api_client.get(f'/api/payments/{payment.id}/qr/').status_code == 401
