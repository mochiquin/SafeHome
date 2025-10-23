import { KeyRound } from "lucide-react";
import { SECTION_TITLES, CONFIRMATION_CODE_HINT } from "./constants";

/**
 * Props for BookingConfirmationCode component
 */
interface BookingConfirmationCodeProps {
  confirmationCode: number;
}

/**
 * Component to display booking confirmation code
 * Shows a 4-digit code that customers share with providers to verify the job
 * Only visible to customers, not providers
 */
export function BookingConfirmationCode({ confirmationCode }: BookingConfirmationCodeProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <KeyRound className="h-5 w-5" />
        {SECTION_TITLES.confirmation}
      </h3>
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-2">
          {CONFIRMATION_CODE_HINT}
        </p>
        <p className="text-3xl font-bold text-blue-600 tracking-widest">
          {confirmationCode}
        </p>
      </div>
    </div>
  );
}

