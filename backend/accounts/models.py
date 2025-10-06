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
