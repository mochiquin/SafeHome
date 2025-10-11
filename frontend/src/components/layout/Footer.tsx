"use client";

import { Logo } from "@/components/pro-blocks/logo";
import Link from "next/link";
import { Separator } from "@/components/ui";

export function Footer() {
  return (
    <footer
      className="bg-muted py-8"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 flex flex-col gap-12 lg:gap-16">

        {/* Bottom Section */}
        <div className="flex w-full justify-center">
          {/* Copyright Text */}
          <p className="text-muted-foreground text-center">
            <span>Copyright © {new Date().getFullYear()}</span>{" "}
            <Link href="/" className="hover:underline">
              SafeHome
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
