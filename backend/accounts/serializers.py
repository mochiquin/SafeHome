"""
Serializers for the accounts app
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import ConsentLog

User = get_user_model()


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
            'vaccinated'
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
                role=validated_data.get('role'),
                city=validated_data.get('city'),
                vaccinated=validated_data.get('vaccinated', False)
            )

            # Create consent log
            ConsentLog.objects.create(
                user=user,
                policy_version='1.0',  # Current policy version
                ip_address=ip_address,
                user_agent=user_agent
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
            'date_joined',
            'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
