"""
Views for the accounts app
"""
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from core import success_response, error_response
from core.parsers import EncryptedJSONParser
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer


class IsCustomer(BasePermission):
    """Permission class for customer-only access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'customer'


class IsProvider(BasePermission):
    """Permission class for provider-only access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'provider'


class IsAdmin(BasePermission):
    """Permission class for admin-only access"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class CanCreateServices(BasePermission):
    """Permission class for users who can create/manage services (providers and admins)"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.can_create_services()


@method_decorator(csrf_exempt, name='dispatch')
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
    parser_classes = [EncryptedJSONParser]

    def create(self, request, *args, **kwargs):
        """Create user and return success response"""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # Return user data (without sensitive information)
        user_data = UserSerializer(user).data

        return success_response(
            data={'user': user_data},
            message='User registered successfully',
            status_code=status.HTTP_201_CREATED
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Get and update user profile.

    GET /api/auth/me - Get current user profile
    PATCH /api/auth/me - Update current user profile
    """
    from .authentication import JWTCookieAuthentication
    
    serializer_class = UserSerializer
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [EncryptedJSONParser]
    
    def get_object(self):
        """Get the current authenticated user"""
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        """Get current user profile with unified response format"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success_response(
            data=serializer.data,
            message='User profile retrieved successfully'
        )
    
    def update(self, request, *args, **kwargs):
        """Update current user profile with unified response format"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return success_response(
            data=serializer.data,
            message='User profile updated successfully'
        )


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(generics.GenericAPIView):
    """
    Login with email and password, returns JWT tokens in HttpOnly cookies.

    POST /api/auth/login
    {
        "email": "user@example.com",
        "password": "password123"
    }
    """
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    parser_classes = [EncryptedJSONParser]
    
    def post(self, request):
        """Authenticate user and set JWT cookies"""
        User = get_user_model()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        requested_role = serializer.validated_data.get('role')

        if not email or not password:
            return error_response(
                message='Email and password are required',
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Get user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return error_response(
                message='Invalid credentials',
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        # Check password
        if not user.check_password(password):
            return error_response(
                message='Invalid credentials',
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        # If role is specified, verify user has that role
        if requested_role and user.role != requested_role:
            return error_response(
                message=f'Access denied. User is registered as {user.role}, not {requested_role}',
                status_code=status.HTTP_403_FORBIDDEN
            )

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        # Create response
        response = success_response(
            data={'user': UserSerializer(user).data},
            message='Login successful',
            status_code=status.HTTP_200_OK
        )

        # Set HttpOnly cookies
        # For cross-origin requests (localhost:3000 -> localhost:8000), we need:
        # 1. CORS_ALLOW_CREDENTIALS = True (already set)
        # 2. withCredentials: true in axios (already set)
        # 3. samesite='None' and secure=True for cross-origin, BUT for localhost HTTP we use 'Lax'
        response.set_cookie(
            'access_token',
            str(refresh.access_token),
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
            httponly=True,
            secure=False,  # Must be False for localhost HTTP
            samesite='Lax',  # Lax allows cookies in same-site contexts
            path='/',  # Available for all paths
        )

        response.set_cookie(
            'refresh_token',
            str(refresh),
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
            httponly=True,
            secure=False,  # Must be False for localhost HTTP
            samesite='Lax',  # Lax allows cookies in same-site contexts
            path='/',  # Available for all paths
        )

        return response


class CustomerDashboardView(APIView):
    """
    Dashboard for customers - shows available services, bookings, etc.
    GET /api/auth/customer/dashboard
    """
    from .authentication import JWTCookieAuthentication
    
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsCustomer]

    def get(self, request):
        """Get customer dashboard data"""
        user = request.user

        # Get user's bookings count
        bookings_count = user.bookings.count()

        # Get available services count
        from services.models import Service
        services_count = Service.objects.filter(is_active=True).count()

        dashboard_data = {
            'user': UserSerializer(user).data,
            'stats': {
                'total_bookings': bookings_count,
                'available_services': services_count,
            },
            'recent_bookings': [],  # Could add recent bookings logic here
        }

        return success_response(
            data=dashboard_data,
            message='Customer dashboard data retrieved successfully'
        )


class ProviderDashboardView(APIView):
    """
    Dashboard for service providers - shows their services, bookings, earnings, etc.
    GET /api/auth/provider/dashboard
    """
    from .authentication import JWTCookieAuthentication
    
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [IsAuthenticated, IsProvider]

    def get(self, request):
        """Get provider dashboard data"""
        user = request.user

        # Get provider's services count
        services_count = user.services.count()

        # Get bookings for provider's services
        bookings_count = 0  # Would need to implement this logic

        # Get earnings (would need payment integration)
        earnings = 0

        dashboard_data = {
            'user': UserSerializer(user).data,
            'stats': {
                'total_services': services_count,
                'total_bookings': bookings_count,
                'total_earnings': earnings,
            },
            'recent_services': [],  # Could add recent services logic
        }

        return success_response(
            data=dashboard_data,
            message='Provider dashboard data retrieved successfully'
        )


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    """
    Logout user by clearing JWT cookies.

    POST /api/auth/logout
    """
    def post(self, request):
        """Clear JWT cookies"""
        response = success_response(
            message='Logout successful',
            status_code=status.HTTP_200_OK
        )

        # Clear cookies
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response


@method_decorator(csrf_exempt, name='dispatch')
class RefreshTokenView(APIView):
    """
    Refresh JWT access token using refresh token cookie.

    POST /api/auth/refresh
    """
    def post(self, request):
        """Refresh access token using refresh token"""
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return error_response(
                message='Refresh token not found',
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        try:
            # Create new tokens from refresh token
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            # Create response
            response = success_response(
                message='Token refreshed successfully',
                status_code=status.HTTP_200_OK
            )

            # Update access token cookie
            response.set_cookie(
                'access_token',
                access_token,
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=True,
                secure=False,  # Must be False for localhost HTTP
                samesite='Lax',  # Lax allows cookies in same-site contexts
                path='/',  # Available for all paths
            )

            return response

        except Exception:
            return error_response(
                message='Invalid refresh token',
                status_code=status.HTTP_401_UNAUTHORIZED
            )
