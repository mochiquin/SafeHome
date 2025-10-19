import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bookingsApi } from '@/lib/apis';
import type { CreateBookingRequest } from '@/lib/types/booking';
import { toast } from 'sonner';

export function useNewBooking() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBooking = async (data: CreateBookingRequest) => {
    setIsSubmitting(true);
    try {
      const response = await bookingsApi.createBooking(data);
      if (response.success) {
        toast.success('Booking created successfully!');
        // Redirect to bookings list
        router.push('/dashboard/customer');
        return true;
      } else {
        throw new Error(response.message || 'Failed to create booking.');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createBooking, isSubmitting };
}

