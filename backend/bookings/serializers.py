"""
Booking serializers for SafeHome
"""
import random
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
            'service_type', 'budget', 'address', 'phone', 'city', 'state', 'country',
            'start_time', 'duration_hours', 'notes'
        ]
        read_only_fields = ['user']

    def validate_start_time(self, value):
        """Validate that start time is not in the past"""
        # Allow some buffer for timezone differences (5 minutes)
        from datetime import timedelta
        min_time = timezone.now() - timedelta(minutes=5)
        if value < min_time:
            raise serializers.ValidationError("Start time must be in the future")
        return value

    def create(self, validated_data):
        """Create booking with encrypted address and phone"""
        # Extract address and phone before they get removed by super().create()
        address = validated_data.pop('address')
        phone = validated_data.pop('phone')

        # Get the user from request context
        user = self.context['request'].user

        # Generate 4-digit confirmation code
        confirmation_code = str(random.randint(1000, 9999))

        # Create booking instance with confirmation code
        booking = Booking.objects.create(
            user=user,
            confirmation_code=confirmation_code,
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
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)
    user = serializers.SerializerMethodField()
    provider = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'provider', 'service_type', 'service_type_display', 'budget',
            'provider_quote', 'address', 'phone', 'city', 'state', 'country', 'start_time',
            'duration_hours', 'status', 'confirmation_code', 'notes', 'payment_status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'confirmation_code', 'created_at', 'updated_at']

    def get_address(self, obj) -> str:
        """Decrypt and return address"""
        return obj.get_address()

    def get_phone(self, obj) -> str:
        """Decrypt and return phone"""
        return obj.get_phone()
    
    def get_user(self, obj):
        """Return user information"""
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email,
                'first_name': obj.user.first_name,
                'last_name': obj.user.last_name,
            }
        return None
    
    def get_provider(self, obj):
        """Return provider information"""
        if obj.provider:
            return {
                'id': obj.provider.id,
                'email': obj.provider.email,
                'first_name': obj.provider.first_name,
                'last_name': obj.provider.last_name,
            }
        return None

    def get_payment_status(self, obj):
        """Return payment status if payment exists"""
        try:
            if hasattr(obj, 'payment'):
                return obj.payment.status
        except:
            pass
        return None


class BookingListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing bookings (without sensitive data)
    """
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'service_type', 'service_type_display', 'city', 'state', 'country',
            'start_time', 'duration_hours', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
