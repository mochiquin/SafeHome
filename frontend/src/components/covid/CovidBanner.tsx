"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, CheckCircle, HelpCircle } from "lucide-react";
import { covidApi } from "@/lib/apis";
import type { RestrictionLevel } from "@/lib/types/covid";

interface CovidBannerProps {
  country: string;
  state?: string;
  city?: string;
}

export function CovidBanner({ country, state, city }: CovidBannerProps) {
  const [restrictionLevel, setRestrictionLevel] = useState<RestrictionLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCity, setLastCity] = useState<string>('');

  useEffect(() => {
    const fetchRestriction = async () => {
      // Clean and normalize city name (remove trailing slashes, extra spaces, etc.)
      const cleanCity = city?.trim().replace(/\/+$/, '') || '';
      
      // Only fetch if city actually changed
      if (!country || !cleanCity || cleanCity === lastCity) {
        if (!country || !cleanCity) {
          setIsLoading(false);
        }
        return;
      }

      setLastCity(cleanCity);
      setIsLoading(true);

      try {
        const response = await covidApi.getRestriction({ 
          country, 
          state, 
          city: cleanCity 
        });
        if (response.success && response.data) {
          setRestrictionLevel(response.data.restriction_level);
        }
      } catch (error) {
        console.error('Failed to fetch COVID restriction:', error);
        setRestrictionLevel('unknown');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestriction();
  }, [country, state, city, lastCity]);

  if (isLoading || !restrictionLevel) {
    return null;
  }

  const config = {
    high: {
      icon: AlertTriangle,
      variant: "destructive" as const,
      title: "High COVID-19 Restrictions",
      description: "This area has high COVID-19 restrictions. Services may be limited. Please check local guidelines.",
      className: "border-red-500 bg-red-50 dark:bg-red-950"
    },
    medium: {
      icon: Info,
      variant: "default" as const,
      title: "Moderate COVID-19 Restrictions",
      description: "This area has moderate COVID-19 restrictions. Some safety measures may apply.",
      className: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
    },
    low: {
      icon: CheckCircle,
      variant: "default" as const,
      title: "Low COVID-19 Restrictions",
      description: "This area has low COVID-19 restrictions. Services are operating normally.",
      className: "border-green-500 bg-green-50 dark:bg-green-950"
    },
    unknown: {
      icon: HelpCircle,
      variant: "default" as const,
      title: "COVID-19 Restriction Status Unknown",
      description: "Unable to determine COVID-19 restrictions for this area. Please check local guidelines.",
      className: "border-gray-500 bg-gray-50 dark:bg-gray-950"
    }
  };

  const { icon: Icon, variant, title, description, className } = config[restrictionLevel];

  return (
    <Alert variant={variant} className={className}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
        {city && ` Location: ${city}${state ? `, ${state}` : ''}, ${country}`}
      </AlertDescription>
    </Alert>
  );
}

