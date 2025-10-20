"""
Booking views for SafeHome
"""
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from accounts.authentication import JWTCookieAuthentication
from core.parsers import EncryptedJSONParser
from core import success_response
from .models import Booking
from .serializers import BookingCreateSerializer, BookingDetailSerializer, BookingListSerializer


class BookingCreateView(generics.CreateAPIView):
    """
    Create a new booking with encrypted address and phone
    """
    serializer_class = BookingCreateSerializer
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [EncryptedJSONParser]

    def get_serializer_context(self):
        """Add request to serializer context for user access"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        """Create booking with unified response format"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return success_response(
            data=serializer.data,
            message='Booking created successfully',
            status_code=status.HTTP_201_CREATED
        )


class BookingListView(generics.ListAPIView):
    """
    List bookings for the authenticated user (with decrypted data)
    """
    serializer_class = BookingDetailSerializer
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return only bookings for the authenticated user"""
        return Booking.objects.filter(user=self.request.user).select_related('provider').order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(
            data=serializer.data,
            message='Bookings retrieved successfully'
        )


class BookingDetailView(generics.RetrieveAPIView):
    """
    Get booking details with decrypted address and phone (owner only)
    """
    serializer_class = BookingDetailSerializer
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Get booking if it belongs to the authenticated user"""
        booking_id = self.kwargs['pk']
        booking = get_object_or_404(Booking, id=booking_id)

        # Check if booking belongs to the authenticated user or provider
        if booking.user != self.request.user and booking.provider != self.request.user:
            from rest_framework.exceptions import NotFound
            raise NotFound("Booking not found")

        return booking
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success_response(
            data=serializer.data,
            message='Booking details retrieved successfully'
        )


class BookingUpdateView(generics.UpdateAPIView):
    """
    Update booking (owner only)
    """
    serializer_class = BookingDetailSerializer
    authentication_classes = [JWTCookieAuthentication]
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
        return success_response(
            data=serializer.data,
            message='Booking updated successfully'
        )


class CancelBookingView(generics.UpdateAPIView):
    """
    Cancel a booking (customer only)
    """
    serializer_class = BookingDetailSerializer
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Get booking if it belongs to the authenticated user"""
        booking_id = self.kwargs['pk']
        booking = get_object_or_404(Booking, id=booking_id)

        # Check if booking belongs to the authenticated user
        if booking.user != self.request.user:
            from rest_framework.exceptions import NotFound
            raise NotFound("Booking not found")
        
        # Check if booking can be cancelled
        if booking.status in ['completed', 'cancelled']:
            from rest_framework.exceptions import ValidationError
            raise ValidationError(f"Cannot cancel a booking that is already {booking.status}")

        return booking

    def update(self, request, *args, **kwargs):
        """Cancel the booking"""
        booking = self.get_object()
        booking.status = 'cancelled'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return success_response(
            data=serializer.data,
            message='Booking cancelled successfully'
        )


@api_view(['GET'])
@authentication_classes([JWTCookieAuthentication])
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


class ProviderBookingListView(generics.ListAPIView):
    """
    List bookings that the provider has accepted (Received Orders)
    """
    from accounts.authentication import JWTCookieAuthentication
    from accounts.views import IsProvider
    
    serializer_class = BookingDetailSerializer
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def get_queryset(self):
        """Return bookings accepted by the current provider"""
        return Booking.objects.filter(
            provider=self.request.user
        ).select_related('user', 'provider').order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        """Override list to return unified response format"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(
            data=serializer.data,
            message='Received orders retrieved successfully'
        )


class AvailableTasksListView(generics.ListAPIView):
    """
    List available tasks (bookings without a provider assigned)
    Providers can view and accept these tasks
    """
    from accounts.authentication import JWTCookieAuthentication
    from accounts.views import IsProvider
    
    serializer_class = BookingDetailSerializer
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def get_queryset(self):
        """Return bookings that don't have a provider yet"""
        return Booking.objects.filter(
            provider__isnull=True,
            status='pending'
        ).select_related('user').order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        """Override list to return unified response format"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(
            data=serializer.data,
            message='Available tasks retrieved successfully'
        )


class AcceptBookingView(generics.UpdateAPIView):
    """
    Accept a booking (assign provider to booking)
    Provider can accept an available task
    """
    from accounts.authentication import JWTCookieAuthentication
    from accounts.views import IsProvider

    serializer_class = BookingDetailSerializer
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def get_object(self):
        """Get booking if it's available (no provider assigned)"""
        booking_id = self.kwargs['pk']
        booking = get_object_or_404(Booking, id=booking_id)

        # Check if booking is available
        if booking.provider is not None:
            from rest_framework.exceptions import ValidationError
            raise ValidationError("This booking has already been accepted by another provider")

        return booking

    def update(self, request, *args, **kwargs):
        """Accept the booking by assigning current provider"""
        booking = self.get_object()

        # Assign provider and update status
        booking.provider = request.user
        booking.status = 'confirmed'
        booking.save()

        serializer = self.get_serializer(booking)
        return success_response(
            data=serializer.data,
            message='Booking accepted successfully'
        )


class StartJobView(generics.UpdateAPIView):
    """
    Start a job (change status from confirmed to in_progress)
    Provider only
    """
    from accounts.authentication import JWTCookieAuthentication
    from accounts.views import IsProvider

    serializer_class = BookingDetailSerializer
    authentication_classes = [JWTCookieAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def get_object(self):
        """Get booking if it belongs to the provider and is confirmed"""
        booking_id = self.kwargs['pk']
        booking = get_object_or_404(Booking, id=booking_id)

        # Check if booking belongs to this provider
        if booking.provider != self.request.user:
            from rest_framework.exceptions import NotFound
            raise NotFound("Booking not found")

        # Check if booking status is confirmed
        if booking.status != 'confirmed':
            from rest_framework.exceptions import ValidationError
            raise ValidationError(f"Cannot start job. Current status is {booking.status}")

        return booking

    def update(self, request, *args, **kwargs):
        """Start the job by changing status to in_progress"""
        booking = self.get_object()
        booking.status = 'in_progress'
        booking.save()

        serializer = self.get_serializer(booking)
        return success_response(
            data=serializer.data,
            message='Job started successfully'
        )