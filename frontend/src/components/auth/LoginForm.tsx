"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();

  const handleLogin = () => {
    // Here you would typically handle authentication
    // For demo purposes, we'll just redirect to services page
    router.push('/services');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="Email" type="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" placeholder="Password" type="password" />
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
        Log in
      </Button>
    </div>
  );
}
