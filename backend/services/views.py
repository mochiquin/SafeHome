"""
Views for the services app
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .models import Service
from .serializers import ServiceSerializer, ServiceDetailSerializer


class ServiceListView(generics.ListAPIView):
    """
    List all active services.

    GET /api/services
    """
    serializer_class = ServiceSerializer
    queryset = Service.objects.filter(is_active=True)
    pagination_class = None  # No pagination for simple list
    permission_classes = [AllowAny]  # Allow unauthenticated access


class ServiceDetailView(generics.RetrieveAPIView):
    """
    Get detailed information about a specific service.

    GET /api/services/{id}
    """
    serializer_class = ServiceDetailSerializer
    queryset = Service.objects.filter(is_active=True)
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def get_object(self):
        """Get service object, return 404 if not found or inactive"""
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, id=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj