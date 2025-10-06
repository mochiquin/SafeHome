"""
Views for the accounts app
"""
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    Register a new user account.

    POST /api/auth/register
    {
        "email": "user@example.com",
        "username": "username",
        "first_name": "First",
        "last_name": "Last",
        "password": "password123",
        "password_confirm": "password123",
        "consent": true,
        "role": "customer",
        "city": "New York",
        "vaccinated": true
    }
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """Create user and return success response"""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # Return user data (without sensitive information)
        user_data = UserSerializer(user).data

        return Response({
            'message': 'User registered successfully',
            'user': user_data
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get and update user profile.

    GET /api/auth/me - Get current user profile
    PATCH /api/auth/me - Update current user profile
    """
    serializer_class = UserSerializer
    permission_classes = []  # Will be set by authentication

    def get_object(self):
        """Get the current authenticated user"""
        return self.request.user
