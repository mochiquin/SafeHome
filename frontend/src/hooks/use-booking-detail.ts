import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { bookingsApi, authApi, paymentsApi } from '@/lib/apis';
import type { Booking } from '@/lib/types/booking';
import { toast } from 'sonner';

/**
 * Custom hook for managing booking detail page logic
 * Handles data fetching, payment processing, and booking cancellation
 * 
 * @param bookingId - The ID of the booking to display
 * @returns Object containing booking data, loading states, and action handlers
 */
export function useBookingDetail(bookingId: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProvider, setIsProvider] = useState(false);
  const [isPayingNow, setIsPayingNow] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  /**
   * Fetch booking details and user role
   */
  const fetchBooking = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch both booking and current user info in parallel
      const [bookingResponse, userResponse] = await Promise.all([
        bookingsApi.getBooking(bookingId),
        authApi.me()
      ]);

      if (bookingResponse.success && bookingResponse.data) {
        setBooking(bookingResponse.data);

        // Determine if current user is a provider
        if (userResponse.success && userResponse.data) {
          setIsProvider(userResponse.data.role === 'provider');
        }
      } else {
        throw new Error(bookingResponse.message || 'Failed to fetch booking');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch booking details');
      router.push('/dashboard/customer?tab=bookings');
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, router]);

  /**
   * Verify payment status after returning from Stripe checkout
   */
  useEffect(() => {
    const verifyPayment = async () => {
      const paymentStatus = searchParams.get('payment');

      if (paymentStatus === 'success') {
        // Retrieve session_id from localStorage
        const sessionId = localStorage.getItem('stripe_session_id');

        if (sessionId) {
          try {
            // Verify payment with backend
            const response = await paymentsApi.verifyPaymentSession(sessionId);

            if (response.success && response.data?.payment_status === 'paid') {
              toast.success('Payment completed successfully!');
              // Clear session_id from localStorage
              localStorage.removeItem('stripe_session_id');
              // Refresh booking data to get updated payment_status
              const bookingResponse = await bookingsApi.getBooking(bookingId);
              if (bookingResponse.success && bookingResponse.data) {
                setBooking(bookingResponse.data);
              }
            } else {
              toast.warning('Payment verification pending');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast.error('Failed to verify payment');
          }
        } else {
          toast.success('Payment completed!');
        }

        // Clean URL by removing query parameters
        router.replace(`/dashboard/booking/${bookingId}`, { scroll: false });
      } else if (paymentStatus === 'cancelled') {
        toast.error('Payment was cancelled');
        // Clear session_id from localStorage
        localStorage.removeItem('stripe_session_id');
        // Clean URL
        router.replace(`/dashboard/booking/${bookingId}`, { scroll: false });
      }
    };

    verifyPayment();
  }, [searchParams, bookingId, router]);

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  /**
   * Handle payment initiation
   * Creates a Stripe checkout session and redirects user
   */
  const handlePayNow = async () => {
    setIsPayingNow(true);
    try {
      const response = await paymentsApi.createStripeCheckout({
        booking_id: bookingId
      });
      
      if (response.success && response.data) {
        // Save session_id to localStorage for verification after return
        localStorage.setItem('stripe_session_id', response.data.session_id);
        // Redirect to Stripe checkout page
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error(response.message || 'Failed to create checkout session');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate payment');
      setIsPayingNow(false);
    }
  };

  /**
   * Handle booking cancellation
   * Cancels the booking and redirects to bookings list
   */
  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      const response = await bookingsApi.cancelBooking(bookingId);
      
      if (response.success) {
        toast.success('Booking cancelled successfully');
        router.push('/dashboard/customer?tab=bookings');
      } else {
        throw new Error(response.message || 'Failed to cancel booking');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  /**
   * Navigate back to bookings list
   */
  const handleBack = () => {
    router.push('/dashboard/customer?tab=bookings');
  };

  return {
    // Data
    booking,
    isProvider,
    
    // Loading states
    isLoading,
    isPayingNow,
    isCancelling,
    
    // Actions
    handlePayNow,
    handleCancelBooking,
    handleBack,
    refetch: fetchBooking
  };
}

