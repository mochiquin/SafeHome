from django.urls import path
from .views import (
    BookingCreateView,
    BookingListView,
    BookingDetailView,
    BookingUpdateView,
    user_booking_stats
)

urlpatterns = [
    # Create booking
    path('create/', BookingCreateView.as_view(), name='booking-create'),

    # List user's bookings
    path('my-bookings/', BookingListView.as_view(), name='booking-list'),

    # Booking statistics
    path('stats/', user_booking_stats, name='booking-stats'),

    # Booking detail (by ID)
    path('<uuid:pk>/', BookingDetailView.as_view(), name='booking-detail'),

    # Update booking
    path('<uuid:pk>/update/', BookingUpdateView.as_view(), name='booking-update'),
]
