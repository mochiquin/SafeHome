"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Label, Checkbox, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { authApi } from "@/lib/apis";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { Info, ExternalLink } from 'lucide-react';
import { toast } from "sonner";
import { Controller } from "react-hook-form";

interface RegisterFormProps {
  role: 'customer' | 'provider';
}

export function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: role,
      vaccinated: false,
    },
  });

  React.useEffect(() => {
    setValue('role', role);
  }, [role, setValue]);

  const watchRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(data);

      if (response.success && response.data?.user) {
        toast.success("Account created successfully!");
        // Registration successful - cookies are set by the server
        // Redirect based on user role
        const userRole = response.data.user.role || 'customer';
        router.push(`/dashboard/${userRole}`);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      // Extract error message from the response
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.data) {
        // Handle field-level errors from Django REST Framework
        const fieldErrors = Object.entries(err.data)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return messages.join(', ');
            }
            return String(messages);
          })
          .join('. ');
        
        if (fieldErrors) {
          errorMessage = fieldErrors;
        }
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            placeholder="First name"
            {...register('first_name')}
            disabled={isLoading}
          />
          {errors.first_name && (
            <p className="text-sm text-red-600">{errors.first_name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            placeholder="Last name"
            {...register('last_name')}
            disabled={isLoading}
          />
          {errors.last_name && (
            <p className="text-sm text-red-600">{errors.last_name.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Label htmlFor="username" className="inline-flex items-center">
              Username * <Info className="ml-1 h-3 w-3" />
            </Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>Must be at least 3 characters long.</p>
          </TooltipContent>
        </Tooltip>
        <Input
          id="username"
          placeholder="Choose a username"
          {...register('username')}
          disabled={isLoading}
        />
        {errors.username && (
          <p className="text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          placeholder="Choose a password"
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password_confirm">Confirm Password *</Label>
        <Input
          id="password_confirm"
          type="password"
          placeholder="Confirm your password"
          {...register('password_confirm')}
          disabled={isLoading}
        />
        {errors.password_confirm && (
          <p className="text-sm text-red-600">{errors.password_confirm.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Your city"
          {...register('city')}
          disabled={isLoading}
        />
        {errors.city && (
          <p className="text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>
      {watchRole === 'provider' && (
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="provider_id" className="inline-flex items-center">
                Provider ID * <Info className="ml-1 h-3 w-3" />
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enter your unique 16-digit Provider ID provided by SafeHome.</p>
            </TooltipContent>
          </Tooltip>
          <Input
            id="provider_id"
            placeholder="Enter your 16-digit Provider ID"
            maxLength={16}
            {...register('provider_id')}
            disabled={isLoading}
          />
          {errors.provider_id && (
            <p className="text-sm text-red-600">{errors.provider_id.message}</p>
          )}
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="vaccinated"
          {...register('vaccinated')}
          disabled={isLoading}
        />
        <Label htmlFor="vaccinated">I am vaccinated against COVID-19</Label>
      </div>
      <Controller
        name="consent"
        control={control}
        render={({ field }: { field: any }) => (
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
                className="mt-1"
              />
              <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                I have read and agree to SafeHome's{' '}
                <Link 
                  href="/privacy-policy" 
                  target="_blank"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Privacy Policy & Terms of Service
                  <ExternalLink className="h-3 w-3" />
                </Link>
                {' '}*
              </Label>
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              By checking this box, you consent to the collection, use, and processing of your 
              personal data as described in our Privacy Policy. Your sensitive information 
              (address, phone) will be encrypted for your protection.
            </p>
          </div>
        )}
      />
      {errors.consent && (
        <p className="text-sm text-red-600 ml-6">{errors.consent.message}</p>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
