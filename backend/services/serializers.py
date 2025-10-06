"""
Serializers for the services app
"""
from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    """Serializer for Service model with limited fields for public API"""

    class Meta:
        model = Service
        fields = [
            'id',
            'title',
            'description',
            'price',
            'category',
            'estimated_duration'
        ]
        read_only_fields = ['id']


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed service information"""

    class Meta:
        model = Service
        fields = [
            'id',
            'title',
            'description',
            'price',
            'category',
            'estimated_duration',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
