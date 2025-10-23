import { Phone } from "lucide-react";
import { SECTION_TITLES, FIELD_LABELS } from "./constants";

/**
 * Props for BookingContactInfo component
 */
interface BookingContactInfoProps {
  phone?: string;
}

/**
 * Component to display contact information
 * Shows the customer's phone number
 */
export function BookingContactInfo({ phone }: BookingContactInfoProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Phone className="h-5 w-5" />
        {SECTION_TITLES.contact}
      </h3>
      <div>
        <p className="text-sm text-muted-foreground">{FIELD_LABELS.phoneNumber}</p>
        <p className="font-medium">{phone}</p>
      </div>
    </div>
  );
}

