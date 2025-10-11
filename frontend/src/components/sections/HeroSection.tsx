"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ImageWithBackground } from "@/components/ui/image-with-background";

export function HeroSection() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
            {/* Image Section - 1/3 width */}
            <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
              <ImageWithBackground
                src="/provider.png"
                alt="Professional Home Services"
              />
            </div>

            {/* Content Section - 2/3 width */}
            <div className="w-full lg:w-2/3 flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Expert Home Services at Your Doorstep
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Get professional home maintenance, repairs, and inspections from
                  certified experts. Book trusted services for plumbing, electrical,
                  cleaning, and more - all in one place.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg">
                  Book Service
                </Button>
                <Button variant="ghost" size="lg">
                  View Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
