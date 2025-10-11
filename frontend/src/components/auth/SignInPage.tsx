import React from 'react';
import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Logo } from "./Logo";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { SocialLoginButtons } from "./SocialLoginButtons";

export function SignInPage() {
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

        {/* Separator with "Or" text */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or
            </span>
          </div>
        </div>

        {/* Social login buttons */}
        <SocialLoginButtons />
      </div>
    </div>
  );
}
