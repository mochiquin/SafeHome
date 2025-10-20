import { useState } from 'react';
import { bookingsApi } from '@/lib/apis';
import { toast } from 'sonner';

export function useStartJob() {
  const [isLoading, setIsLoading] = useState(false);

  const startJob = async (bookingId: string) => {
    setIsLoading(true);
    try {
      const response = await bookingsApi.startJob(bookingId);
      if (response.success) {
        toast.success(response.message || 'Job started successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to start job');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { startJob, isLoading };
}
