import { DollarSign, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SECTION_TITLES, FIELD_LABELS } from "./constants";

/**
 * Props for BookingPaymentInfo component
 */
interface BookingPaymentInfoProps {
  budget?: number;
  providerQuote?: number;
  paymentStatus?: string | null;
}

/**
 * Component to display payment and pricing information
 * Shows budget, provider quote, and payment status
 * Visible to both customers and providers
 */
export function BookingPaymentInfo({ budget, providerQuote, paymentStatus }: BookingPaymentInfoProps) {
  // Determine payment status display
  const isPaid = paymentStatus === 'paid';
  const statusColor = isPaid ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  const statusText = isPaid ? 'Paid' : 'Pending Payment';
  const StatusIcon = isPaid ? CheckCircle : Clock;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5" />
        {SECTION_TITLES.payment}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer Budget */}
        {budget && (
          <div>
            <p className="text-sm text-muted-foreground">{FIELD_LABELS.customerBudget}</p>
            <p className="font-medium text-lg">${Number(budget).toFixed(2)}</p>
          </div>
        )}

        {/* Provider Quote */}
        {providerQuote && (
          <div>
            <p className="text-sm text-muted-foreground">{FIELD_LABELS.providerQuote}</p>
            <p className="font-medium text-green-600 text-lg">
              ${Number(providerQuote).toFixed(2)}
            </p>
          </div>
        )}

        {/* Payment Status */}
        <div>
          <p className="text-sm text-muted-foreground">{FIELD_LABELS.paymentStatus}</p>
          <Badge
            variant="outline"
            className={`${statusColor} font-medium mt-1 flex items-center gap-1 w-fit`}
          >
            <StatusIcon className="h-3 w-3" />
            {statusText}
          </Badge>
        </div>
      </div>
    </div>
  );
}

