import React from 'react';
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

export function SignInDialog() {
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

      </DialogContent>
    </Dialog>
  );
}
