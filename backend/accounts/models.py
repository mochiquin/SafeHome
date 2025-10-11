from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Override email field to make it unique
    email = models.EmailField(unique=True, verbose_name='email address')

    # User role choices
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('provider', 'Service Provider'),
        ('admin', 'Administrator'),
    ]

    # Custom fields as per requirements
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='customer',
        verbose_name='User Role',
        help_text='User role: customer, provider, or admin'
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='City',
        help_text='User city for location-based services'
    )

    vaccinated = models.BooleanField(
        default=False,
        verbose_name='Vaccinated Status',
        help_text='COVID-19 vaccination status'
    )

    # Use email as username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.email} ({self.get_full_name()}) - {self.role}"

    # Role checking methods
    def is_customer(self):
        """Check if user is a customer"""
        return self.role == 'customer'

    def is_provider(self):
        """Check if user is a service provider"""
        return self.role == 'provider'

    def is_admin(self):
        """Check if user is an administrator"""
        return self.role == 'admin'

    def can_create_services(self):
        """Check if user can create/manage services (providers and admins)"""
        return self.role in ['provider', 'admin']

    def can_book_services(self):
        """Check if user can book services (customers)"""
        return self.role == 'customer'


class ConsentLog(models.Model):
    """Model to track user consent for various policies and terms"""

    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='consent_logs',
        verbose_name='User'
    )

    policy_version = models.CharField(
        max_length=50,
        verbose_name='Policy Version',
        help_text='Version of the policy/terms that was consented to'
    )

    consent_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Consent Timestamp',
        help_text='When the user gave consent'
    )

    ip_address = models.GenericIPAddressField(
        blank=True,
        null=True,
        verbose_name='IP Address',
        help_text='IP address from which consent was given'
    )

    user_agent = models.TextField(
        blank=True,
        null=True,
        verbose_name='User Agent',
        help_text='Browser/client information when consent was given'
    )

    class Meta:
        verbose_name = 'Consent Log'
        verbose_name_plural = 'Consent Logs'
        ordering = ['-consent_at']
        # Prevent duplicate consent logs for same user and policy version
        unique_together = ['user', 'policy_version']

    def __str__(self):
        return f"{self.user.email} - {self.policy_version} ({self.consent_at})"
