import { Home } from "lucide-react";
import { SECTION_TITLES, FIELD_LABELS } from "./constants";

/**
 * Props for BookingServiceInfo component
 */
interface BookingServiceInfoProps {
  serviceType: string;
  serviceTypeDisplay?: string;
  budget?: number;
}

/**
 * Component to display service information
 * Shows service type and customer budget (if provided)
 */
export function BookingServiceInfo({ serviceType, serviceTypeDisplay, budget }: BookingServiceInfoProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Home className="h-5 w-5" />
        {SECTION_TITLES.service}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{FIELD_LABELS.serviceType}</p>
          <p className="font-medium">{serviceTypeDisplay || serviceType}</p>
        </div>
        {budget && (
          <div>
            <p className="text-sm text-muted-foreground">{FIELD_LABELS.customerBudget}</p>
            <p className="font-medium">${Number(budget).toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

