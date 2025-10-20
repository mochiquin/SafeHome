import { useState, useEffect, useCallback } from 'react';
import { bookingsApi } from '@/lib/apis';
import type { Booking } from '@/lib/types/booking';
import { toast } from 'sonner';

export function useAvailableTasks() {
  const [tasks, setTasks] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingsApi.getAvailableTasks();
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch available tasks.');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptTask = useCallback(async (bookingId: string, providerQuote?: number) => {
    try {
      const response = await bookingsApi.acceptBooking(bookingId, providerQuote);
      if (response.success) {
        toast.success('Task accepted successfully!');
        // Remove the accepted task from the list
        setTasks(prev => prev.filter(task => task.id !== bookingId));
        return true;
      } else {
        throw new Error(response.message || 'Failed to accept task.');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred.';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, isLoading, error, refetch: fetchTasks, acceptTask };
}

