import { MapPin } from "lucide-react";
import { SimpleMap } from "@/components/maps";
import { SECTION_TITLES, FIELD_LABELS } from "./constants";

/**
 * Props for BookingLocationInfo component
 */
interface BookingLocationInfoProps {
  address?: string;
  city: string;
  state?: string;
  country: string;
}

/**
 * Component to display location information
 * Shows address, city, state, country, and an interactive map
 * Reuses the SimpleMap component for map display
 */
export function BookingLocationInfo({ address, city, state, country }: BookingLocationInfoProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        {SECTION_TITLES.location}
      </h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{FIELD_LABELS.address}</p>
          <p className="font-medium">{address}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{FIELD_LABELS.city}</p>
            <p className="font-medium">{city}</p>
          </div>
          {state && (
            <div>
              <p className="text-sm text-muted-foreground">{FIELD_LABELS.state}</p>
              <p className="font-medium">{state}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">{FIELD_LABELS.country}</p>
            <p className="font-medium">{country}</p>
          </div>
        </div>

        {/* Interactive map showing the booking location */}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">{FIELD_LABELS.map}</p>
          <SimpleMap
            address={address ? `${address}, ${city || ''}` : city}
            height="250px"
          />
        </div>
      </div>
    </div>
  );
}

