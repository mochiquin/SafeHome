import { User } from "lucide-react";
import type { Booking } from "@/lib/types/booking";
import { SECTION_TITLES, FIELD_LABELS } from "./constants";

/**
 * Props for BookingProviderInfo component
 */
interface BookingProviderInfoProps {
  provider?: Booking['provider'];
  providerQuote?: number;
}

/**
 * Component to display provider information
 * Shows provider name, email, and quoted price
 * Consolidates all provider-related information in one section
 */
export function BookingProviderInfo({ provider, providerQuote }: BookingProviderInfoProps) {
  if (!provider) {
    return null;
  }

  const providerName = provider.first_name || provider.last_name
    ? `${provider.first_name || ''} ${provider.last_name || ''}`.trim()
    : FIELD_LABELS.notProvided;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <User className="h-5 w-5" />
        {SECTION_TITLES.provider}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{FIELD_LABELS.providerName}</p>
          <p className="font-medium">{providerName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{FIELD_LABELS.providerEmail}</p>
          <p className="font-medium">{provider.email}</p>
        </div>
        {providerQuote && (
          <div>
            <p className="text-sm text-muted-foreground">{FIELD_LABELS.providerQuote}</p>
            <p className="font-medium text-green-600 text-lg">
              ${Number(providerQuote).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

