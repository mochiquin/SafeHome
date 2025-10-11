import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/logo.png"
        alt="SafeHome Logo"
        width={120}
        height={40}
        className="h-10 w-auto"
      />
    </div>
  );
}
