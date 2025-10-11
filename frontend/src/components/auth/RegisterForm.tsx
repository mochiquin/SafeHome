import React from 'react';
import { Button, Input, Label } from "@/components/ui";

export function RegisterForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Your name" type="text" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="Email" type="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" placeholder="Password" type="password" />
      </div>
      <Button className="w-full">Create account</Button>
    </div>
  );
}
