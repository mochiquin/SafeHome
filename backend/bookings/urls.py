from django.urls import path
from .views import (
    BookingCreateView,
    BookingListView,
    BookingDetailView,
    BookingUpdateView,
    CancelBookingView,
    user_booking_stats,
    ProviderBookingListView,
    AvailableTasksListView,
    AcceptBookingView,
    StartJobView
)

urlpatterns = [
    # Create booking
    path('create/', BookingCreateView.as_view(), name='booking-create'),

    # List user's bookings
    path('my-bookings/', BookingListView.as_view(), name='booking-list'),

    # Provider's view of accepted bookings (Received Orders)
    path('provider/received/', ProviderBookingListView.as_view(), name='provider-bookings'),

    # Provider's view of available tasks (bookings without provider)
    path('provider/available/', AvailableTasksListView.as_view(), name='available-tasks'),

    # Provider accepts a booking
    path('<uuid:pk>/accept/', AcceptBookingView.as_view(), name='accept-booking'),

    # Provider starts a job
    path('<uuid:pk>/start/', StartJobView.as_view(), name='start-job'),

    # Booking statistics
    path('stats/', user_booking_stats, name='booking-stats'),

    # Booking detail (by ID)
    path('<uuid:pk>/', BookingDetailView.as_view(), name='booking-detail'),

    # Update booking
    path('<uuid:pk>/update/', BookingUpdateView.as_view(), name='booking-update'),
    
    # Cancel booking
    path('<uuid:pk>/cancel/', CancelBookingView.as_view(), name='booking-cancel'),
]
