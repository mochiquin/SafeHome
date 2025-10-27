"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookingDetail } from "@/hooks/use-booking-detail";
import {
  BookingDetailHeader,
  BookingServiceInfo,
  BookingScheduleInfo,
  BookingLocationInfo,
  BookingContactInfo,
  BookingConfirmationCode,
  BookingProviderInfo,
  BookingPaymentInfo,
  BookingNotesInfo,
  BookingActions
} from "@/components/dashboard/booking-detail";

/**
 * Booking detail page component
 * Displays comprehensive information about a specific booking including
 * service details, schedule, location, payment status, and actions
 */
export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  // Use custom hook to manage all booking detail logic
  const {
    booking,
    isProvider,
    isLoading,
    isPayingNow,
    isCancelling,
    handlePayNow,
    handleCancelBooking,
    handleBack
  } = useBookingDetail(bookingId);

  // Show loading state while fetching booking data
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading booking details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Return null if booking data is not available
  if (!booking) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BookingDetailHeader
        bookingId={booking.id}
        status={booking.status}
        onBack={handleBack}
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Display service type and budget information */}
          <BookingServiceInfo
            serviceType={booking.service_type}
            serviceTypeDisplay={booking.service_type_display}
            budget={booking.budget}
          />

          <Separator />

          {/* Display booking schedule: date, time, and duration */}
          <BookingScheduleInfo
            startTime={booking.start_time}
            durationHours={booking.duration_hours}
          />

          <Separator />

          {/* Display location details with interactive map */}
          <BookingLocationInfo
            address={booking.address}
            city={booking.city}
            state={booking.state}
            country={booking.country}
          />

          <Separator />

          {/* Display contact phone number */}
          <BookingContactInfo phone={booking.phone} />

          {/* Show confirmation code only to customers (not providers) */}
          {!isProvider && (
            <>
              <Separator />
              <BookingConfirmationCode confirmationCode={booking.confirmation_code} />
            </>
          )}

          {/* Show provider information only to customers when provider is assigned */}
          {!isProvider && booking.provider && (
            <>
              <Separator />
              <BookingProviderInfo
                provider={booking.provider}
                providerQuote={booking.provider_quote}
              />
            </>
          )}

          {/* Show payment & pricing information to providers */}
          {isProvider && (booking.budget || booking.provider_quote || booking.payment_status) && (
            <>
              <Separator />
              <BookingPaymentInfo
                budget={booking.budget}
                providerQuote={booking.provider_quote}
                paymentStatus={booking.payment_status}
              />
            </>
          )}

          {/* Display additional notes if provided */}
          {booking.notes && (
            <>
              <Separator />
              <BookingNotesInfo notes={booking.notes} />
            </>
          )}

          {/* Action buttons: Payment and cancellation */}
          <Separator />
          <BookingActions
            booking={booking}
            isProvider={isProvider}
            onPayNow={handlePayNow}
            onCancel={handleCancelBooking}
            isPayingNow={isPayingNow}
            isCancelling={isCancelling}
          />
        </CardContent>
      </Card>
    </div>
  );
}
