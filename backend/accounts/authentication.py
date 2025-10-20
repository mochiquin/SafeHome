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
        print(f"DEBUG AUTH: request.COOKIES.keys() = {list(request.COOKIES.keys())}")
        access_token = request.COOKIES.get('access_token')
        print(f"DEBUG AUTH: access_token = {access_token[:50] if access_token else None}...")

        if not access_token:
            print("DEBUG AUTH: No access_token found in cookies, returning None")
            return None  # No token, let other authenticators handle it

        # Validate the token
        print(f"DEBUG AUTH: Validating token...")
        try:
            validated_token = self.get_validated_token(access_token)
            print(f"DEBUG AUTH: Token validated successfully")
        except (InvalidToken, TokenError) as e:
            raise exceptions.AuthenticationFailed('Invalid token') from e

        # Get user from validated token
        print(f"DEBUG AUTH: Getting user from token...")
        try:
            user = self.get_user(validated_token)
            print(f"DEBUG AUTH: Got user: {user.email} (id={user.id})")
        except Exception:
            raise exceptions.AuthenticationFailed('Invalid token')

        return (user, validated_token)
