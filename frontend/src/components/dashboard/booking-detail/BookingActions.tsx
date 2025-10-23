import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DollarSign } from "lucide-react";
import type { Booking } from "@/lib/types/booking";
import { BUTTON_LABELS, DIALOG_MESSAGES } from "./constants";

/**
 * Props for BookingActions component
 */
interface BookingActionsProps {
  booking: Booking;
  isProvider: boolean;
  onPayNow: () => void;
  onCancel: () => void;
  isPayingNow: boolean;
  isCancelling: boolean;
}

/**
 * Component to display action buttons for the booking
 * Shows payment button (for customers) and cancellation option
 * Handles different states: pending, confirmed, paid
 */
export function BookingActions({
  booking,
  isProvider,
  onPayNow,
  onCancel,
  isPayingNow,
  isCancelling
}: BookingActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      {/* Payment button - Only visible to customers with confirmed bookings that have a price */}
      {!isProvider && booking.status === 'confirmed' && (booking.provider_quote || booking.budget) && (
        booking.payment_status === 'paid' ? (
          <Button
            disabled
            className="bg-green-600 hover:bg-green-700"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            {BUTTON_LABELS.paid}
          </Button>
        ) : (
          <Button
            onClick={onPayNow}
            disabled={isPayingNow}
            className="bg-green-600 hover:bg-green-700"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            {isPayingNow ? BUTTON_LABELS.redirecting : BUTTON_LABELS.payNow}
          </Button>
        )
      )}

      {/* Cancel button - Available for pending or confirmed bookings */}
      {(booking.status === 'pending' || booking.status === 'confirmed') && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isCancelling}>
              {isCancelling ? BUTTON_LABELS.cancelling : BUTTON_LABELS.cancelBooking}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{DIALOG_MESSAGES.cancelTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {DIALOG_MESSAGES.cancelDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{BUTTON_LABELS.noKeepIt}</AlertDialogCancel>
              <AlertDialogAction
                onClick={onCancel}
                className="bg-red-600 hover:bg-red-700"
              >
                {BUTTON_LABELS.yesCancelBooking}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

