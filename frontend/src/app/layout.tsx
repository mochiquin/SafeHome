import type { Metadata } from "next";
import { Inter } from "next/font/google";
// These styles apply to every route in the application
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SafeHome",
  description: "Your safety is our priority.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
