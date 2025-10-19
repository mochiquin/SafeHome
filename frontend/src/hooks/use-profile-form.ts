import { useState } from 'react';
import { authApi } from '@/lib/apis';
import { toast } from 'sonner';
import type { User } from '@/lib/types/user';

export function useProfileForm() {
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const response = await authApi.updateProfile(data);
      
      if (response.success) {
        toast.success('Profile updated successfully');
        return true;
      } else {
        toast.error(response.message || 'Failed to update profile');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.deleteAccount();
      
      if (response.success) {
        toast.success('Account deleted successfully');
        return true;
      } else {
        toast.error(response.message || 'Failed to delete account');
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    deleteAccount,
    isLoading
  };
}

