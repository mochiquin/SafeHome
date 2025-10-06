"""
Models for the services app
"""
from django.db import models
from core.models import UUIDModel


class Service(UUIDModel):
    """Model for home services offered"""

    title = models.CharField(
        max_length=200,
        verbose_name='Service Title',
        help_text='Name of the service (e.g., "House Cleaning", "Plumbing Repair")'
    )

    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Service Description',
        help_text='Detailed description of what the service includes'
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Service Price',
        help_text='Price per hour or per service'
    )

    category = models.CharField(
        max_length=100,
        verbose_name='Service Category',
        help_text='Category (e.g., "Cleaning", "Maintenance", "Emergency")'
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name='Is Active',
        help_text='Whether this service is currently available'
    )

    estimated_duration = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name='Estimated Duration (hours)',
        help_text='Estimated time to complete the service in hours'
    )

    class Meta:
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
        ordering = ['category', 'title']

    def __str__(self):
        return f"{self.title} ({self.category}) - ${self.price}"
