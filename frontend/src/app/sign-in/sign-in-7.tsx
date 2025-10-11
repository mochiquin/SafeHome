"use client";

import { Logo } from "@/components/pro-blocks/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export function SignIn7() {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center">
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
                <Button className="w-full">Log in</Button>
              </div>
            </TabsContent>

            {/* Create account form */}
            <TabsContent value="create">
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
            </TabsContent>
          </Tabs>

          {/* Separator with "Or" text */}
          <div className="relative">
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
          <div className="space-y-3">
            {/* Google sign-in button */}
            <Button variant="outline" className="w-full space-x-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_772_376)">
                  <path
                    d="M8 6.54543V9.64361H12.3054C12.1164 10.64 11.549 11.4836 10.6981 12.0509L13.2945 14.0655C14.8072 12.6692 15.68 10.6182 15.68 8.18187C15.68 7.61461 15.6291 7.0691 15.5345 6.54551L8 6.54543Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M3.51625 9.52267L2.93067 9.97093L0.85791 11.5854C2.17427 14.1963 4.87225 16 7.9995 16C10.1594 16 11.9703 15.2873 13.294 14.0655L10.6976 12.0509C9.98492 12.5309 9.07582 12.8218 7.9995 12.8218C5.91951 12.8218 4.15229 11.4182 3.51952 9.52729L3.51625 9.52267Z"
                    fill="#34A853"
                  />
                  <path
                    d="M0.858119 4.41455C0.312695 5.49087 0 6.70543 0 7.99996C0 9.29448 0.312695 10.509 0.858119 11.5854C0.858119 11.5926 3.51998 9.51991 3.51998 9.51991C3.35998 9.03991 3.26541 8.53085 3.26541 7.99987C3.26541 7.46889 3.35998 6.95984 3.51998 6.47984L0.858119 4.41455Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M7.99966 3.18545C9.17786 3.18545 10.2251 3.59271 11.0615 4.37818L13.3524 2.0873C11.9633 0.792777 10.1597 0 7.99966 0C4.87242 0 2.17427 1.79636 0.85791 4.41455L3.51969 6.48001C4.15238 4.58908 5.91968 3.18545 7.99966 3.18545Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_772_376">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span>Sign in with Google</span>
            </Button>

            {/* Apple sign-in button */}
            <Button variant="outline" className="w-full space-x-2">
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_772_457)">
                  <path
                    d="M15.0281 12.469C14.7862 13.028 14.4998 13.5426 14.1679 14.0157C13.7156 14.6606 13.3452 15.107 13.0598 15.3549C12.6173 15.7618 12.1433 15.9702 11.6357 15.982C11.2712 15.982 10.8317 15.8783 10.3201 15.668C9.80687 15.4586 9.33518 15.3549 8.90389 15.3549C8.45156 15.3549 7.96644 15.4586 7.44754 15.668C6.92785 15.8783 6.5092 15.9879 6.18911 15.9988C5.70231 16.0195 5.21709 15.8052 4.73276 15.3549C4.42364 15.0853 4.03698 14.623 3.57379 13.9683C3.07681 13.269 2.66823 12.4582 2.34815 11.5338C2.00534 10.5353 1.8335 9.56838 1.8335 8.63231C1.8335 7.56005 2.06519 6.63524 2.52928 5.86025C2.89401 5.23775 3.37922 4.7467 3.98651 4.38622C4.5938 4.02574 5.24998 3.84204 5.95662 3.83028C6.34328 3.83028 6.85032 3.94989 7.48043 4.18494C8.10875 4.42079 8.5122 4.54039 8.68908 4.54039C8.82132 4.54039 9.2695 4.40054 10.0293 4.12173C10.7478 3.86317 11.3542 3.75611 11.851 3.79829C13.1971 3.90692 14.2084 4.43757 14.881 5.3936C13.6771 6.12306 13.0815 7.14475 13.0934 8.45543C13.1042 9.47634 13.4746 10.3259 14.2025 11.0004C14.5323 11.3135 14.9007 11.5555 15.3106 11.7273C15.2217 11.9851 15.1279 12.232 15.0281 12.469V12.469ZM11.9408 0.320267C11.9408 1.12045 11.6485 1.86758 11.0658 2.55911C10.3626 3.38121 9.51207 3.85626 8.58972 3.7813C8.57797 3.6853 8.57116 3.58427 8.57116 3.4781C8.57116 2.70992 8.90557 1.88782 9.49942 1.21565C9.79591 0.875312 10.173 0.592328 10.6303 0.366586C11.0865 0.144212 11.5181 0.0212348 11.924 0.000175476C11.9359 0.107147 11.9408 0.214126 11.9408 0.320256V0.320267Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_772_457">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <span>Sign in with Apple</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
