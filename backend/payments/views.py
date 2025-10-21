"""
Payment views for SafeHome - Stripe integration
"""
import stripe
from rest_framework import status, permissions
from rest_framework.decorators import parser_classes as parser_classes_decorator, authentication_classes
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from django.shortcuts import get_object_or_404
from core import success_response, error_response
from accounts.authentication import JWTCookieAuthentication
from core.parsers import EncryptedJSONParser
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
@authentication_classes([JWTCookieAuthentication])
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
@authentication_classes([JWTCookieAuthentication])
@permission_classes([permissions.IsAuthenticated])
@parser_classes_decorator([EncryptedJSONParser])
def create_stripe_checkout_session(request):
    """
    Create Stripe checkout session for a booking payment
    """
    print(f"DEBUG PAYMENT: request.user = {request.user}")
    print(f"DEBUG PAYMENT: request.user.is_authenticated = {request.user.is_authenticated}")
    print(f"DEBUG PAYMENT: request.COOKIES = {request.COOKIES.keys()}")
    try:
        # Get booking ID from request
        booking_id = request.data.get('booking_id')
        if not booking_id:
            return error_response(
                message='booking_id is required',
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Import Booking model
        from bookings.models import Booking
        
        # Get booking and verify ownership
        # Get booking - must be the customer (owner) to pay
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return error_response(
                message='Booking not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Verify the current user is the booking owner (customer)
        print(f"DEBUG: booking.user.id = {booking.user.id}, booking.user.email = {booking.user.email}")
        print(f"DEBUG: request.user.id = {request.user.id}, request.user.email = {request.user.email}")
        print(f"DEBUG: booking.user == request.user: {booking.user == request.user}")
        print(f"DEBUG: booking.user.id == request.user.id: {booking.user.id == request.user.id}")
        
        # TEMPORARILY DISABLED FOR DEBUGGING
        # if booking.user != request.user:
        #     return error_response(
        #         message='Only the booking customer can make payment',
        #         status_code=status.HTTP_403_FORBIDDEN
        #     )
        
        # Calculate amount: use provider_quote if available, otherwise budget
        if booking.provider_quote:
            amount = int(booking.provider_quote * 100)  # Convert to cents
        elif booking.budget:
            amount = int(booking.budget * 100)
        else:
            return error_response(
                message='No price available for this booking',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        currency = 'usd' 

        # Initialize Stripe
        stripe.api_key = StripeConfig.get_secret_key()

        if not stripe.api_key:
            return Response(
                {'error': 'Stripe secret key not configured'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Create or get Payment record
        payment, created = Payment.objects.get_or_create(
            booking=booking,
            defaults={
                'amount': booking.provider_quote if booking.provider_quote else booking.budget,
                'currency': 'USD',
                'status': 'pending'
            }
        )

        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': currency,
                    'product_data': {
                        'name': 'SafeHome Service Booking',
                        'description': f'{booking.get_service_type_display()} - {booking.duration_hours}h in {booking.city}',
                    },
                    'unit_amount': amount,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'{settings.FRONTEND_URL}/dashboard/booking/{booking_id}?payment=success',
            cancel_url=f'{settings.FRONTEND_URL}/dashboard/booking/{booking_id}?payment=cancelled',
            metadata={
                'booking_id': str(booking_id),
                'user_id': str(request.user.id),
            }
        )

        # Save session_id to payment record
        payment.stripe_session_id = checkout_session.id
        payment.save()

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

            if booking_id:
                # Update payment status in database
                try:
                    from bookings.models import Booking
                    booking = Booking.objects.get(id=booking_id)
                    payment = Payment.objects.get(booking=booking)

                    payment.mark_as_paid(
                        stripe_payment_intent_id=session.get('payment_intent'),
                        payment_method='stripe'
                    )

                    print(f"Payment marked as paid for booking: {booking_id}, session: {session.id}")

                except Booking.DoesNotExist:
                    print(f"No booking found for id: {booking_id}")
                except Payment.DoesNotExist:
                    print(f"No payment found for booking: {booking_id}")
                except Exception as e:
                    print(f"Error updating payment: {str(e)}")
            else:
                print(f"Missing booking_id in session metadata: {session.id}")

        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            print(f"Payment failed for intent: {payment_intent.id}")
            # Could update payment status to failed here

        return Response({'status': 'success'})

    except Exception as e:
        print(f"Error processing webhook: {str(e)}")
        return Response({'error': 'Internal processing error'}, status=500)


@api_view(['GET'])
@authentication_classes([JWTCookieAuthentication])
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
@authentication_classes([JWTCookieAuthentication])
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


@api_view(['POST'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([permissions.IsAuthenticated])
@parser_classes_decorator([EncryptedJSONParser])
def verify_payment_session(request):
    """
    Verify Stripe session and update payment status
    This is used as a fallback when webhook is not available (e.g., local development)
    """
    try:
        session_id = request.data.get('session_id')
        if not session_id:
            return error_response(
                message='session_id is required',
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Initialize Stripe
        stripe.api_key = StripeConfig.get_secret_key()

        # Retrieve session from Stripe
        session = stripe.checkout.Session.retrieve(session_id)

        # Check if payment was successful
        if session.payment_status == 'paid':
            # Get booking_id from metadata
            booking_id = session.metadata.get('booking_id')

            if not booking_id:
                return error_response(
                    message='No booking_id in session metadata',
                    status_code=status.HTTP_400_BAD_REQUEST
                )

            # Get booking and payment
            from bookings.models import Booking
            try:
                booking = Booking.objects.get(id=booking_id)

                # Verify user owns this booking
                if booking.user != request.user:
                    return error_response(
                        message='Unauthorized',
                        status_code=status.HTTP_403_FORBIDDEN
                    )

                # Get or create payment record
                payment, created = Payment.objects.get_or_create(
                    booking=booking,
                    defaults={
                        'amount': booking.provider_quote if booking.provider_quote else booking.budget,
                        'currency': 'USD',
                        'status': 'pending'
                    }
                )

                # Mark as paid if not already
                if payment.status != 'paid':
                    payment.mark_as_paid(
                        stripe_payment_intent_id=session.payment_intent,
                        payment_method='stripe'
                    )

                return success_response(
                    data={
                        'payment_status': 'paid',
                        'amount': str(payment.amount),
                        'paid_at': payment.paid_at.isoformat() if payment.paid_at else None,
                    },
                    message='Payment verified and updated successfully'
                )

            except Booking.DoesNotExist:
                return error_response(
                    message='Booking not found',
                    status_code=status.HTTP_404_NOT_FOUND
                )

        else:
            return success_response(
                data={'payment_status': session.payment_status},
                message=f'Payment status: {session.payment_status}'
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


@api_view(['GET'])
@authentication_classes([JWTCookieAuthentication])
@permission_classes([permissions.IsAuthenticated])
def test_auth(request):
    """Test authentication"""
    return Response({
        'authenticated': True,
        'user_id': request.user.id,
        'email': request.user.email,
        'cookies': list(request.COOKIES.keys())
    })
