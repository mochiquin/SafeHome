"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [userType, setUserType] = useState<'customer' | 'provider'>('customer');

  const handleLogin = () => {
    // Here you would typically handle authentication
    // For demo purposes, we'll redirect based on user type
    if (userType === 'provider') {
      router.push('/dashboard/provider');
    } else {
      router.push('/dashboard/customer');
    }
  };

  return (
    <div className="space-y-4">
      {/* User Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">I am a:</Label>
        <RadioGroup value={userType} onValueChange={(value) => setUserType(value as 'customer' | 'provider')}>
          <RadioGroupItem value="customer" id="customer">
            Customer - I need home services
          </RadioGroupItem>
          <RadioGroupItem value="provider" id="provider">
            Service Provider - I offer home services
          </RadioGroupItem>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="Enter your email" type="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" placeholder="Enter your password" type="password" />
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
      <Button className="w-full" onClick={handleLogin}>
        Log in as {userType === 'customer' ? 'Customer' : 'Service Provider'}
      </Button>
    </div>
  );
}
