"""
Serializers for the accounts app
"""
from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from .models import ConsentLog, User, ProviderIDWhitelist


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""

    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    consent = serializers.BooleanField(
        write_only=True,
        required=True,
        help_text='Must agree to terms and conditions'
    )

    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
            'consent',
            'role',
            'city',
            'vaccinated',
            'provider_id'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }

    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        """Validate username uniqueness"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_role(self, value):
        """Validate that the role is one of the allowed choices"""
        if value not in ['customer', 'provider', 'admin']:
            raise serializers.ValidationError("Invalid role. Must be 'customer', 'provider', or 'admin'.")
        return value

    def validate_provider_id(self, value):
        """Validate provider_id against whitelist"""
        if value:
            # Check if it's exactly 16 characters
            if len(value) != 16:
                raise serializers.ValidationError("Provider ID must be exactly 16 characters.")

            # Check if ID exists in whitelist
            try:
                whitelist_entry = ProviderIDWhitelist.objects.get(provider_id=value)
            except ProviderIDWhitelist.DoesNotExist:
                raise serializers.ValidationError("Invalid Provider ID. This ID is not authorized.")

            # Check if ID has already been used
            if whitelist_entry.is_used:
                raise serializers.ValidationError("This Provider ID has already been used.")

        return value

    def validate(self, data):
        """Validate password confirmation and consent"""
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'Password confirmation does not match.'
            })

        if not data.get('consent'):
            raise serializers.ValidationError({
                'consent': 'You must agree to the terms and conditions.'
            })

        # Validate provider_id is required for providers
        if data.get('role') == 'provider' and not data.get('provider_id'):
            raise serializers.ValidationError({
                'provider_id': 'Provider ID is required for provider accounts.'
            })

        # Validate provider_id is not provided for non-providers
        if data.get('role') != 'provider' and data.get('provider_id'):
            raise serializers.ValidationError({
                'provider_id': 'Provider ID should only be provided for provider accounts.'
            })

        return data

    def create(self, validated_data):
        """Create user and consent log"""
        # Remove fields not needed for user creation
        consent = validated_data.pop('consent')
        password_confirm = validated_data.pop('password_confirm')

        # Get request context for IP and user agent
        request = self.context.get('request')
        ip_address = None
        user_agent = None

        if request:
            ip_address = request.META.get('REMOTE_ADDR')
            # Try to get real IP if behind proxy
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip_address = x_forwarded_for.split(',')[0].strip()
            user_agent = request.META.get('HTTP_USER_AGENT')

        with transaction.atomic():
            # Create user
            user = User.objects.create_user(
                email=validated_data['email'],
                username=validated_data['username'],
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                role=validated_data.get('role', 'customer'),
                city=validated_data.get('city'),
                vaccinated=validated_data.get('vaccinated', False),
                provider_id=validated_data.get('provider_id')
            )

            # Create consent log
            ConsentLog.objects.create(
                user=user,
                policy_version='1.0',  # Current policy version
                ip_address=ip_address,
                user_agent=user_agent
            )

            # Mark provider ID as used if this is a provider account
            if validated_data.get('provider_id'):
                ProviderIDWhitelist.objects.filter(
                    provider_id=validated_data['provider_id']
                ).update(
                    is_used=True,
                    used_at=timezone.now()
                )

        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    role = serializers.ChoiceField(
        choices=[('customer', 'Customer'), ('provider', 'Service Provider')],
        required=False,
        help_text='Optional: specify the role to login as'
    )


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'role',
            'city',
            'vaccinated',
            'provider_id',
            'date_joined',
            'last_login'
        ]
        read_only_fields = ['id', 'email', 'username', 'provider_id', 'date_joined', 'last_login']
