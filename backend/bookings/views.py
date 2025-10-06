"""
Booking views for SafeHome
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from .models import Booking
from .serializers import BookingCreateSerializer, BookingDetailSerializer, BookingListSerializer


class BookingCreateView(generics.CreateAPIView):
    """
    Create a new booking with encrypted address and phone
    """
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        """Add request to serializer context for user access"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class BookingListView(generics.ListAPIView):
    """
    List bookings for the authenticated user (without sensitive data)
    """
    serializer_class = BookingListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return only bookings for the authenticated user"""
        return Booking.objects.filter(user=self.request.user)


class BookingDetailView(generics.RetrieveAPIView):
    """
    Get booking details with decrypted address and phone (owner only)
    """
    serializer_class = BookingDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Get booking if it belongs to the authenticated user"""
        booking_id = self.kwargs['pk']
        booking = get_object_or_404(Booking, id=booking_id)

        # Check if booking belongs to the authenticated user
        if booking.user != self.request.user:
            from rest_framework.exceptions import NotFound
            raise NotFound("Booking not found")

        return booking


class BookingUpdateView(generics.UpdateAPIView):
    """
    Update booking (owner only)
    """
    serializer_class = BookingDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Get booking if it belongs to the authenticated user"""
        booking_id = self.kwargs['pk']
        booking = get_object_or_404(Booking, id=booking_id)

        # Check if booking belongs to the authenticated user
        if booking.user != self.request.user:
            from rest_framework.exceptions import NotFound
            raise NotFound("Booking not found")

        return booking

    def update(self, request, *args, **kwargs):
        """Handle partial updates with encryption"""
        instance = self.get_object()

        # Handle address and phone updates with encryption
        if 'address' in request.data:
            instance.set_address(request.data['address'])

        if 'phone' in request.data:
            instance.set_phone(request.data['phone'])

        # Update other fields normally
        for field, value in request.data.items():
            if field not in ['address', 'phone']:
                setattr(instance, field, value)

        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_booking_stats(request):
    """
    Get booking statistics for the authenticated user
    """
    user = request.user

    # Get booking counts by status
    stats = Booking.objects.filter(user=user).aggregate(
        total=Count('id'),
        pending=Count('id', filter=Q(status='pending')),
        confirmed=Count('id', filter=Q(status='confirmed')),
        in_progress=Count('id', filter=Q(status='in_progress')),
        completed=Count('id', filter=Q(status='completed')),
        cancelled=Count('id', filter=Q(status='cancelled'))
    )

    return Response(stats)
