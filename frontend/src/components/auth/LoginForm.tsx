"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { authApi } from "@/lib/apis";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

interface LoginFormProps {
  role: 'customer' | 'provider';
}

export function LoginForm({ role }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: role,
    },
  });

  React.useEffect(() => {
    setValue('role', role);
  }, [role, setValue]);

  const watchRole = watch('role');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Clear any existing token before login to prevent conflicts
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }

      const response = await authApi.login(data);

      if (response.success && response.data?.user) {
        // Login successful - cookies are set by the server
        // Redirect based on user role
        const userRole = response.data.user.role || 'customer';
        router.push(`/dashboard/${userRole}`);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      // Extract error message from the response
      let errorMessage = 'Login failed. Please check your credentials.';
      
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
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="keep-signed-in" />
          <Label htmlFor="keep-signed-in">Keep me signed in</Label>
        </div>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm underline"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  );
}
