import React from 'react';
import { useRouter } from 'next/navigation';
import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Logo } from "./Logo";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { User, Wrench } from "lucide-react";

export function SignInPage() {
  const router = useRouter();
  return (
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
            <LoginForm />
          </TabsContent>

          {/* Create account form */}
          <TabsContent value="create">
            <RegisterForm />
          </TabsContent>
        </Tabs>

        {/* Role selection tabs */}
        <div className="mt-6">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">Choose your account type</p>
          </div>
          <Tabs defaultValue="customer" className="gap-4">
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

            <TabsContent value="customer" className="mt-4">
              <div
                className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => router.push('/dashboard/customer')}
              >
                <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-blue-900 mb-1">Continue as Customer</h3>
                <p className="text-sm text-blue-700">Book and manage home services</p>
              </div>
            </TabsContent>

            <TabsContent value="provider" className="mt-4">
              <div
                className="text-center p-4 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => router.push('/dashboard/provider')}
              >
                <Wrench className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold text-green-900 mb-1">Continue as Provider</h3>
                <p className="text-sm text-green-700">Offer and manage your services</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
