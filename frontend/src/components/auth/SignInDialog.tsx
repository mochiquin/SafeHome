import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "./Logo";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { User, Wrench } from "lucide-react";

export function SignInDialog() {
  const router = useRouter();

  return (
    <Dialog>
      {/* Button to open the sign-in dialog */}
      <DialogTrigger asChild>
        <Button variant="outline">Open Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        {/* Dialog header with logo and description */}
        <DialogHeader>
          <Logo className="mb-6" />
          <DialogTitle className="text-lg font-bold">Get started</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit interdum
            hendrerit ex vitae sodales.
          </DialogDescription>
        </DialogHeader>

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
        <div className="mt-4">
          <div className="text-center mb-3">
            <p className="text-xs text-muted-foreground">Choose your account type</p>
          </div>
          <Tabs defaultValue="customer" className="gap-3">
            <TabsList className="grid w-full grid-cols-2 h-9">
              <TabsTrigger value="customer" className="flex items-center gap-1 text-xs">
                <User className="h-3 w-3" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="provider" className="flex items-center gap-1 text-xs">
                <Wrench className="h-3 w-3" />
                Provider
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer" className="mt-3">
              <div
                className="text-center p-3 bg-blue-50 rounded-md border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors text-sm"
                onClick={() => router.push('/dashboard/customer')}
              >
                <User className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                <h4 className="font-medium text-blue-900 mb-1">Continue as Customer</h4>
                <p className="text-xs text-blue-700">Book and manage home services</p>
              </div>
            </TabsContent>

            <TabsContent value="provider" className="mt-3">
              <div
                className="text-center p-3 bg-green-50 rounded-md border border-green-200 cursor-pointer hover:bg-green-100 transition-colors text-sm"
                onClick={() => router.push('/dashboard/provider')}
              >
                <Wrench className="h-6 w-6 mx-auto mb-1 text-green-600" />
                <h4 className="font-medium text-green-900 mb-1">Continue as Provider</h4>
                <p className="text-xs text-green-700">Offer and manage your services</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
