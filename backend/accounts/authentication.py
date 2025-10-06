"""
Custom authentication classes for JWT cookie-based authentication
"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework import exceptions


class JWTCookieAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that reads token from HttpOnly cookie
    """

    def authenticate(self, request):
        # First try to get token from cookie
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            return None  # No token, let other authenticators handle it

        # Validate the token
        try:
            validated_token = self.get_validated_token(access_token)
        except (InvalidToken, TokenError) as e:
            raise exceptions.AuthenticationFailed('Invalid token') from e

        # Get user from validated token
        try:
            user = self.get_user(validated_token)
        except Exception:
            raise exceptions.AuthenticationFailed('Invalid token')

        return (user, validated_token)
