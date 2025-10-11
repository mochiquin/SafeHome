"use client";

import Image from "next/image";

interface ImageWithBackgroundProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithBackground({ src, alt, className = "" }: ImageWithBackgroundProps) {
  return (
    <div className={`relative flex justify-center ${className}`}>
      <div className="relative">
        {/* Decorative background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-orange-100 scale-110 opacity-70"></div>

        {/* Image container */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
