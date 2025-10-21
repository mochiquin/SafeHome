"""
Payment models for SafeHome
"""
import uuid
import secrets
from django.db import models
from django.core.exceptions import ValidationError
from core.models import UUIDModel


class Payment(UUIDModel):
    """
    Model for payment transactions with Stripe integration
    """
    # One-to-one relationship with booking
    booking = models.OneToOneField(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='payment',
        verbose_name='Booking',
        help_text='The booking this payment is for'
    )

    # Payment amount
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Amount',
        help_text='Payment amount in USD'
    )

    # Payment status
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Payment Status'
    )

    # QR Code token for mobile payments
    qr_token = models.CharField(
        max_length=64,
        unique=True,
        blank=True,
        null=True,
        verbose_name='QR Token',
        help_text='Unique token for QR code payments'
    )

    # Stripe integration fields
    stripe_session_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='Stripe Session ID',
        help_text='Stripe checkout session ID'
    )

    stripe_payment_intent_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='Stripe Payment Intent ID',
        help_text='Stripe payment intent ID'
    )

    # Payment method
    payment_method = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name='Payment Method',
        help_text='Payment method used (card, wallet, etc.)'
    )

    # Additional payment details
    currency = models.CharField(
        max_length=3,
        default='USD',
        verbose_name='Currency',
        help_text='Payment currency (ISO 4217)'
    )

    # Metadata
    metadata = models.JSONField(
        blank=True,
        null=True,
        verbose_name='Payment Metadata',
        help_text='Additional payment information as JSON'
    )

    # Timestamps
    paid_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Paid At',
        help_text='When payment was completed'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-created_at']
        # Ensure one payment per booking
        constraints = [
            models.UniqueConstraint(
                fields=['booking'],
                name='unique_booking_payment'
            )
        ]
        # Indexes for performance
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['qr_token']),
            models.Index(fields=['stripe_session_id']),
            models.Index(fields=['stripe_payment_intent_id']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Payment {self.id} - {self.booking.service.title} - ${self.amount}"

    def clean(self):
        """Custom validation"""
        super().clean()

        # Validate amount is positive
        if self.amount <= 0:
            raise ValidationError("Payment amount must be positive")

        # Validate currency format
        if len(self.currency) != 3:
            raise ValidationError("Currency must be 3 characters (ISO 4217)")

    def save(self, *args, **kwargs):
        """Override save to generate QR token if not provided"""
        if not self.qr_token:
            self.qr_token = self._generate_qr_token()

        # Validate before saving
        self.full_clean()

        super().save(*args, **kwargs)

    def _generate_qr_token(self) -> str:
        """Generate a unique QR token"""
        while True:
            # Generate a secure random token
            token = secrets.token_urlsafe(32)

            # Check if token already exists
            if not Payment.objects.filter(qr_token=token).exists():
                return token

    def mark_as_paid(self, stripe_payment_intent_id: str = None,
                    payment_method: str = None):
        """Mark payment as paid"""
        from django.utils import timezone
        self.status = 'paid'
        self.paid_at = timezone.now()
        if stripe_payment_intent_id:
            self.stripe_payment_intent_id = stripe_payment_intent_id
        if payment_method:
            self.payment_method = payment_method
        self.save()

    def mark_as_failed(self):
        """Mark payment as failed"""
        self.status = 'failed'
        self.save()

    def cancel(self):
        """Cancel payment"""
        if self.status in ['pending', 'processing']:
            self.status = 'cancelled'
            self.save()

    def refund(self):
        """Refund payment"""
        if self.status == 'paid':
            self.status = 'refunded'
            self.save()

    # Property methods for easier access
    @property
    def is_paid(self) -> bool:
        """Check if payment is completed"""
        return self.status == 'paid'

    @property
    def is_pending(self) -> bool:
        """Check if payment is pending"""
        return self.status == 'pending'

    @property
    def can_cancel(self) -> bool:
        """Check if payment can be cancelled"""
        return self.status in ['pending', 'processing']

    @property
    def can_refund(self) -> bool:
        """Check if payment can be refunded"""
        return self.status == 'paid'
