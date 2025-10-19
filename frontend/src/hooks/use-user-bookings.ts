import { useState, useEffect, useCallback } from 'react';
import { bookingsApi } from '@/lib/apis';
import type { Booking } from '@/lib/types/booking';
import { toast } from 'sonner';

export function useUserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingsApi.getBookings();
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch bookings.');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, isLoading, error, refetch: fetchBookings };
}

