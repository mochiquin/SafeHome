import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { authApi } from '@/lib/apis';
import { type User } from '@/lib/types/user';
import { profileSchema, type ProfileFormData } from '@/lib/validations/profile';

export function useProfileForm() {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await authApi.me();
        if (response.success && response.data) {
          setUser(response.data);
          reset(response.data); // Populate form with user data
        } else {
          toast.error(response.message || 'Failed to fetch user profile.');
        }
      } catch (error: any) {
        toast.error(error.message || 'An error occurred while fetching your profile.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await authApi.updateProfile(data);
      if (response.success && response.data) {
        toast.success('Profile updated successfully!');
        setUser(response.data);
        reset(response.data); // Reset form with new data to clear isDirty state
      } else {
        toast.error(response.message || 'Failed to update profile.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while updating your profile.');
    }
  };

  return {
    user,
    isLoading,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isDirty,
  };
}
