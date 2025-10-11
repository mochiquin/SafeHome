"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui";
import { User, Wrench } from "lucide-react";

export function SocialLoginButtons() {
  const router = useRouter();

  const handleCustomerLogin = () => {
    router.push('/dashboard/customer');
  };

  const handleProviderLogin = () => {
    router.push('/dashboard/provider');
  };

  return (
    <div className="space-y-3">
      {/* Customer login button */}
      <Button
        variant="outline"
        className="w-full space-x-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800"
        onClick={handleCustomerLogin}
      >
        <User className="h-4 w-4" />
        <span>Continue as Customer</span>
      </Button>

      {/* Service Provider login button */}
      <Button
        variant="outline"
        className="w-full space-x-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800"
        onClick={handleProviderLogin}
      >
        <Wrench className="h-4 w-4" />
        <span>Continue as Service Provider</span>
      </Button>
    </div>
  );
}
