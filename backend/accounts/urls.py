from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    RegisterView, UserProfileView, LoginView, LogoutView, RefreshTokenView,
    CustomerDashboardView, ProviderDashboardView
)

urlpatterns = [
    # JWT Authentication endpoints (legacy, still available)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Cookie-based authentication endpoints
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh_cookie'),

    # Registration and profile endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserProfileView.as_view(), name='user_profile'),

    # Role-specific dashboard endpoints
    path('customer/dashboard/', CustomerDashboardView.as_view(), name='customer_dashboard'),
    path('provider/dashboard/', ProviderDashboardView.as_view(), name='provider_dashboard'),
]
