"""
Payment views for SafeHome - Stripe integration
"""
import stripe
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from django.shortcuts import get_object_or_404
from core import success_response, error_response
from .models import Payment


class StripeConfig:
    """Stripe configuration and utilities"""

    @staticmethod
    def get_publishable_key():
        """Get Stripe publishable key"""
        return getattr(settings, 'STRIPE_PUBLISHABLE_KEY', None)

    @staticmethod
    def get_secret_key():
        """Get Stripe secret key"""
        return getattr(settings, 'STRIPE_SECRET_KEY', None)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def stripe_config(request):
    """
    Get Stripe configuration for frontend
    """
    publishable_key = StripeConfig.get_publishable_key()

    if not publishable_key:
        return error_response(
            message='Stripe publishable key not configured',
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return success_response(
        data={'publishableKey': publishable_key},
        message='Stripe configuration retrieved successfully'
    )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_stripe_checkout_session(request):
    """
    Create Stripe checkout session for a booking payment
    """
    try:
        # Get booking ID from request
        booking_id = request.data.get('booking_id')
        if not booking_id:
            return Response(
                {'error': 'booking_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get booking (this would need to be implemented)
        # For now, let's assume we have a way to get booking by ID
        # booking = get_object_or_404(Booking, id=booking_id, user=request.user)

        # For demo purposes, let's create a test payment scenario
        # In real implementation, this would be based on actual booking
        amount = request.data.get('amount', 1000)  # Amount in cents
        currency = request.data.get('currency', 'usd')

        # Initialize Stripe
        stripe.api_key = StripeConfig.get_secret_key()

        if not stripe.api_key:
            return Response(
                {'error': 'Stripe secret key not configured'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': currency,
                    'product_data': {
                        'name': 'SafeHome Service Booking',
                        'description': f'Payment for booking #{booking_id}',
                    },
                    'unit_amount': amount,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'{settings.FRONTEND_URL}/payment/success/?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{settings.FRONTEND_URL}/payment/cancel/',
            metadata={
                'booking_id': str(booking_id),
                'user_id': str(request.user.id),
            }
        )

        return success_response(
            data={
                'checkout_url': checkout_session.url,
                'session_id': checkout_session.id,
            },
            message='Stripe checkout session created successfully'
        )

    except stripe.error.StripeError as e:
        return error_response(
            message=f'Stripe error: {str(e)}',
            status_code=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return error_response(
            message=f'Internal error: {str(e)}',
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def stripe_webhook(request):
    """
    Handle Stripe webhooks with signature verification
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    if not sig_header:
        return error_response(message='No signature provided', status_code=400)

    try:
        # Verify webhook signature
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )

    except ValueError as e:
        return error_response(message='Invalid payload', status_code=400)
    except stripe.error.SignatureVerificationError as e:
        return error_response(message='Invalid signature', status_code=400)
    except Exception as e:
        return error_response(message=f'Webhook verification failed: {str(e)}', status_code=400)

    # Handle the event
    try:
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']

            # Extract metadata to find the payment
            booking_id = session.get('metadata', {}).get('booking_id')
            user_id = session.get('metadata', {}).get('user_id')

            if booking_id and user_id:
                # Update payment status in database
                try:
                    payment = Payment.objects.get(
                        booking__user_id=user_id,
                        # Note: In real implementation, you'd link by booking_id or session_id
                        # For now, we'll update all pending payments for this user
                    )
                    payment.mark_as_paid(
                        stripe_payment_intent_id=session.get('payment_intent'),
                        payment_method='stripe'
                    )

                    print(f"Payment marked as paid for session: {session.id}")

                except Payment.DoesNotExist:
                    print(f"No payment found for session: {session.id}")
                except Exception as e:
                    print(f"Error updating payment: {str(e)}")
            else:
                print(f"Missing metadata in session: {session.id}")

        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            print(f"Payment failed for intent: {payment_intent.id}")
            # Could update payment status to failed here

        return Response({'status': 'success'})

    except Exception as e:
        print(f"Error processing webhook: {str(e)}")
        return Response({'error': 'Internal processing error'}, status=500)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_success(request):
    """
    Handle successful payment return
    """
    session_id = request.query_params.get('session_id')

    if not session_id:
        return error_response(
            message='Session ID is required',
            status_code=status.HTTP_400_BAD_REQUEST
        )

    try:
        stripe.api_key = StripeConfig.get_secret_key()
        session = stripe.checkout.Session.retrieve(session_id)

        return success_response(
            data={
                'payment_status': session.payment_status,
                'amount_total': session.amount_total,
                'currency': session.currency,
            },
            message='Payment processed successfully'
        )

    except Exception as e:
        return error_response(
            message=str(e),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_cancel(request):
    """
    Handle cancelled payment return
    """
    return success_response(
        data={'status': 'cancelled'},
        message='Payment was cancelled by user'
    )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_qr_data(request, payment_id):
    """
    Get QR token and status for a payment (owner only)
    """
    try:
        # Get payment by ID
        payment = Payment.objects.get(id=payment_id)

        # Check if payment belongs to the authenticated user
        if payment.booking.user != request.user:
            return error_response(
                message='Payment not found',
                status_code=status.HTTP_404_NOT_FOUND
            )

        return success_response(
            data={
                'qr_token': payment.qr_token,
                'status': payment.status,
                'amount': str(payment.amount),
                'currency': payment.currency,
            },
            message='Payment QR data retrieved successfully'
        )

    except Payment.DoesNotExist:
        return error_response(
            message='Payment not found',
            status_code=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return error_response(
            message=f'Internal error: {str(e)}',
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
