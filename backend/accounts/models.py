from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Override email field to make it unique
    email = models.EmailField(unique=True, verbose_name='email address')

    # Custom fields as per requirements
    role = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name='User Role',
        help_text='User role (e.g., customer, provider, admin)'
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
        return f"{self.email} ({self.get_full_name()})"


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
