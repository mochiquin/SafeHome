"""
Booking serializers for SafeHome
"""
from rest_framework import serializers
from django.utils import timezone
from .models import Booking
from core.crypto import enc


class BookingCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating bookings with encrypted address and phone
    """
    address = serializers.CharField(
        write_only=True,
        required=True,
        help_text='User address for the booking location'
    )

    phone = serializers.CharField(
        write_only=True,
        required=True,
        help_text='User phone number for contact'
    )

    class Meta:
        model = Booking
        fields = [
            'service', 'address', 'phone', 'city', 'state', 'country',
            'start_time', 'duration_hours', 'notes'
        ]
        read_only_fields = ['user']

    def validate_start_time(self, value):
        """Validate that start time is not in the past"""
        if value <= timezone.now():
            raise serializers.ValidationError("Start time must be in the future")
        return value

    def create(self, validated_data):
        """Create booking with encrypted address and phone"""
        # Extract address and phone before they get removed by super().create()
        address = validated_data.pop('address')
        phone = validated_data.pop('phone')

        # Get the user from request context
        user = self.context['request'].user

        # Create booking instance
        booking = Booking.objects.create(
            user=user,
            **validated_data
        )

        # Encrypt and set address and phone
        booking.set_address(address)
        booking.set_phone(phone)
        booking.save()

        return booking


class BookingDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for booking details with decrypted address and phone
    """
    address = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'service', 'address', 'phone', 'city', 'state', 'country',
            'start_time', 'duration_hours', 'status', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_address(self, obj) -> str:
        """Decrypt and return address"""
        return obj.get_address()

    def get_phone(self, obj) -> str:
        """Decrypt and return phone"""
        return obj.get_phone()


class BookingListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing bookings (without sensitive data)
    """
    class Meta:
        model = Booking
        fields = [
            'id', 'service', 'city', 'state', 'country',
            'start_time', 'duration_hours', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
