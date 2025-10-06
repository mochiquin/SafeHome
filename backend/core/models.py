import uuid
from django.db import models


class UUIDModel(models.Model):
    """Base model with UUID primary key and timestamps"""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name="ID"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At"
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']

    def __str__(self):
        return str(self.id)
