import { FileText } from "lucide-react";
import { SECTION_TITLES } from "./constants";

/**
 * Props for BookingNotesInfo component
 */
interface BookingNotesInfoProps {
  notes?: string;
}

/**
 * Component to display additional notes for the booking
 * Shows customer's special instructions or requirements
 */
export function BookingNotesInfo({ notes }: BookingNotesInfoProps) {
  if (!notes) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        {SECTION_TITLES.notes}
      </h3>
      <p className="text-muted-foreground">{notes}</p>
    </div>
  );
}

