"""
Booking models for SafeHome
"""
from django.db import models
from django.conf import settings
from core.models import UUIDModel
from core.crypto import enc, dec


class Booking(UUIDModel):
    """
    Model for service bookings with encrypted personal information
    """
    # Foreign key to user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
        verbose_name='User'
    )

    # Foreign key to service
    service = models.ForeignKey(
        'services.Service',
        on_delete=models.CASCADE,
        related_name='bookings',
        verbose_name='Service'
    )

    # Encrypted personal information
    address_enc = models.BinaryField(
        verbose_name='Encrypted Address',
        help_text='Encrypted user address for privacy protection'
    )

    phone_enc = models.BinaryField(
        verbose_name='Encrypted Phone',
        help_text='Encrypted user phone number for privacy protection'
    )

    # Geographic information (not encrypted for filtering/searching)
    city = models.CharField(
        max_length=100,
        verbose_name='City',
        help_text='City where service is needed'
    )

    state = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='State/Province',
        help_text='State or province where service is needed'
    )

    country = models.CharField(
        max_length=100,
        default='US',
        verbose_name='Country',
        help_text='Country where service is needed'
    )

    # Booking details
    start_time = models.DateTimeField(
        verbose_name='Start Time',
        help_text='When the service should start'
    )

    duration_hours = models.PositiveIntegerField(
        default=1,
        verbose_name='Duration (hours)',
        help_text='Expected duration of the service in hours'
    )

    # Status choices
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Booking Status'
    )

    # Additional notes
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name='Notes',
        help_text='Additional notes or special instructions'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'
        ordering = ['-created_at']
        # Indexes for performance
        indexes = [
            models.Index(fields=['user', 'start_time']),
            models.Index(fields=['city']),
            models.Index(fields=['status']),
            models.Index(fields=['start_time']),
        ]

    def __str__(self):
        return f"Booking {self.id} - {self.user.email} - {self.service.title}"

    # Encryption/Decryption methods
    def set_address(self, address: str):
        """Encrypt and set the address"""
        self.address_enc = enc(address).encode('utf-8')

    def get_address(self) -> str:
        """Decrypt and return the address"""
        if self.address_enc:
            encrypted_str = self.address_enc.decode('utf-8')
            return dec(encrypted_str)
        return ""

    def set_phone(self, phone: str):
        """Encrypt and set the phone number"""
        self.phone_enc = enc(phone).encode('utf-8')

    def get_phone(self) -> str:
        """Decrypt and return the phone number"""
        if self.phone_enc:
            encrypted_str = self.phone_enc.decode('utf-8')
            return dec(encrypted_str)
        return ""

    # Property methods for easier access
    address = property(get_address, set_address)
    phone = property(get_phone, set_phone)
