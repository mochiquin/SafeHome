import React from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Logo } from "./Logo";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { User, Wrench } from "lucide-react";
import { useState } from "react";

export function SignInPage() {
  const router = useRouter();
  const [role, setRole] = useState<'customer' | 'provider'>('customer');

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-8">
          {/* Header with logo and description */}
          <div className="text-center mb-8">
            <Logo className="mb-6 mx-auto" />
          <h1 className="text-2xl font-bold mb-2">Welcome to SafeHome</h1>
          <p className="text-muted-foreground">
            Book trusted home services with privacy-first security.
            Your data stays protected while connecting you with local professionals.
          </p>
          </div>

          {/* Tabs for login and create account */}
          <Tabs defaultValue="login" className="gap-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="create">Create account</TabsTrigger>
            </TabsList>

            {/* Login form */}
            <TabsContent value="login">
              <LoginForm role={role} />
            </TabsContent>

            {/* Create account form */}
            <TabsContent value="create">
              <RegisterForm role={role} />
            </TabsContent>
          </Tabs>

          {/* Role selection tabs */}
          <div className="mt-6">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Choose your account type</p>
            </div>
            <Tabs
              defaultValue="customer"
              className="gap-4"
              onValueChange={(value) => setRole(value as 'customer' | 'provider')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="provider" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Provider
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}