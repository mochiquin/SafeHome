"""
Admin configuration for accounts app
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, ProviderIDWhitelist, ConsentLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for User model"""
    list_display = ['email', 'username', 'first_name', 'last_name', 'role', 'city', 'vaccinated', 'is_active', 'date_joined']
    list_filter = ['role', 'vaccinated', 'is_active', 'is_staff', 'date_joined']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'city']
    ordering = ['-date_joined']

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'city', 'vaccinated')}),
        ('Role & Permissions', {'fields': ('role', 'provider_id', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    readonly_fields = ['date_joined', 'last_login', 'provider_id']


@admin.register(ProviderIDWhitelist)
class ProviderIDWhitelistAdmin(admin.ModelAdmin):
    """Admin for Provider ID Whitelist"""
    list_display = ['provider_id', 'is_used', 'created_at', 'used_at']
    list_filter = ['is_used', 'created_at']
    search_fields = ['provider_id']
    ordering = ['-created_at']
    readonly_fields = ['is_used', 'created_at', 'used_at']

    fieldsets = (
        (None, {'fields': ('provider_id',)}),
        ('Status', {'fields': ('is_used', 'created_at', 'used_at')}),
    )


@admin.register(ConsentLog)
class ConsentLogAdmin(admin.ModelAdmin):
    """Admin for Consent Log"""
    list_display = ['user', 'policy_version', 'consent_at', 'ip_address']
    list_filter = ['policy_version', 'consent_at']
    search_fields = ['user__email', 'user__username', 'ip_address']
    ordering = ['-consent_at']
    readonly_fields = ['user', 'policy_version', 'consent_at', 'ip_address', 'user_agent']
