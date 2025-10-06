"""
Views for the accounts app
"""
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
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
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Get the current authenticated user"""
        return self.request.user


class LoginView(APIView):
    """
    Login with email and password, returns JWT tokens in HttpOnly cookies.

    POST /api/auth/login
    {
        "email": "user@example.com",
        "password": "password123"
    }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """Authenticate user and set JWT cookies"""
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

        # Check password
        if not user.check_password(password):
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        # Create response
        response = Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

        # Set HttpOnly cookies
        response.set_cookie(
            'access_token',
            str(refresh.access_token),
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
            httponly=True,
            secure=settings.DEBUG is False,  # Secure in production
            samesite='Lax'
        )

        response.set_cookie(
            'refresh_token',
            str(refresh),
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
            httponly=True,
            secure=settings.DEBUG is False,
            samesite='Lax'
        )

        return response


class LogoutView(APIView):
    """
    Logout user by clearing JWT cookies.

    POST /api/auth/logout
    """
    def post(self, request):
        """Clear JWT cookies"""
        response = Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)

        # Clear cookies
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response


class RefreshTokenView(APIView):
    """
    Refresh JWT access token using refresh token cookie.

    POST /api/auth/refresh
    """
    def post(self, request):
        """Refresh access token using refresh token"""
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({
                'error': 'Refresh token not found'
            }, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Create new tokens from refresh token
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            # Create response
            response = Response({
                'message': 'Token refreshed successfully'
            }, status=status.HTTP_200_OK)

            # Update access token cookie
            response.set_cookie(
                'access_token',
                access_token,
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=True,
                secure=settings.DEBUG is False,
                samesite='Lax'
            )

            return response

        except Exception:
            return Response({
                'error': 'Invalid refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)
