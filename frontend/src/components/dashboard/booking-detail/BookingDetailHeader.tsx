import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import type { BookingStatus } from "@/lib/types/booking";
import { STATUS_COLORS, STATUS_LABELS, BUTTON_LABELS, FIELD_LABELS } from "./constants";

/**
 * Props for BookingDetailHeader component
 */
interface BookingDetailHeaderProps {
  bookingId: string;
  status: BookingStatus;
  onBack: () => void;
}

/**
 * Header component for booking detail page
 * Displays back button, booking ID, and status badge
 */
export function BookingDetailHeader({ bookingId, status, onBack }: BookingDetailHeaderProps) {
  return (
    <>
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {BUTTON_LABELS.back}
      </Button>

      <div className="flex items-start justify-between mb-4">
        <div>
          <CardTitle className="text-2xl mb-2">Booking Details</CardTitle>
          <CardDescription>{FIELD_LABELS.bookingId}: {bookingId}</CardDescription>
        </div>
        <Badge
          variant="outline"
          className={`${STATUS_COLORS[status]} font-medium`}
        >
          {STATUS_LABELS[status]}
        </Badge>
      </div>
    </>
  );
}

