from django.urls import path
from .views import (
    test_auth,
    stripe_config,
    create_stripe_checkout_session,
    stripe_webhook,
    verify_payment_session,
    payment_success,
    payment_cancel,
    payment_qr_data
)

urlpatterns = [
    # Stripe configuration for frontend
    path('stripe/config/', stripe_config, name='stripe-config'),

    # Create Stripe checkout session
    path('stripe/checkout/', create_stripe_checkout_session, name='stripe-checkout'),

    # Stripe webhook endpoint (usually called by Stripe, not frontend)
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),

    # Verify payment session (fallback for local development without webhook)
    path('stripe/verify-session/', verify_payment_session, name='verify-payment-session'),

    # Payment success/cancel pages
    path('success/', payment_success, name='payment-success'),
    path('cancel/', payment_cancel, name='payment-cancel'),

    # QR data for mobile payments (owner only)
    path('<uuid:payment_id>/qr/', payment_qr_data, name='payment-qr-data'),
    path('test-auth/', test_auth, name='test-auth'),
]
