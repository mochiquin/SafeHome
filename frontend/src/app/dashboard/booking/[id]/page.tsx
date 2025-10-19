"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Phone, 
  User, 
  FileText,
  Home
} from "lucide-react";
import { bookingsApi } from "@/lib/apis";
import type { Booking } from "@/lib/types/booking";
import { toast } from "sonner";
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

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingsApi.getBooking(bookingId);
        if (response.success && response.data) {
          setBooking(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch booking');
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch booking details');
        router.push('/dashboard/customer?tab=bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, router]);

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      const response = await bookingsApi.cancelBooking(bookingId);
      if (response.success) {
        toast.success('Booking cancelled successfully');
        router.push('/dashboard/customer?tab=bookings');
      } else {
        throw new Error(response.message || 'Failed to cancel booking');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Fetching booking details</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const startDate = new Date(booking.start_time);
  const endDate = new Date(startDate.getTime() + booking.duration_hours * 60 * 60 * 1000);

  const statusColors = {
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };

  const statusLabels = {
    confirmed: "Confirmed",
    completed: "Completed",
    pending: "Pending",
    cancelled: "Cancelled"
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">Booking Details</CardTitle>
              <CardDescription>Booking ID: {booking.id}</CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`${statusColors[booking.status as keyof typeof statusColors]} font-medium`}
            >
              {statusLabels[booking.status as keyof typeof statusLabels]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home className="h-5 w-5" />
              Service Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Service Type</p>
                <p className="font-medium">{booking.service_type_display || booking.service_type}</p>
              </div>
              {booking.budget && (
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">${Number(booking.budget).toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Schedule Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {startDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">
                  {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{booking.duration_hours} hour(s)</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{booking.address}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{booking.city}</p>
                </div>
                {booking.state && (
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="font-medium">{booking.state}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{booking.country}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact
            </h3>
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{booking.phone}</p>
            </div>
          </div>

          {/* Provider Information */}
          {booking.provider && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Provider
                </h3>
                <div>
                  <p className="text-sm text-muted-foreground">Provider Name</p>
                  <p className="font-medium">
                    {booking.provider.first_name || booking.provider.last_name
                      ? `${booking.provider.first_name || ''} ${booking.provider.last_name || ''}`.trim()
                      : booking.provider.email}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {booking.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Additional Notes
                </h3>
                <p className="text-muted-foreground">{booking.notes}</p>
              </div>
            </>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex gap-3 pt-4">
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isCancelling}>
                    {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this booking? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelBooking}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Cancel Booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

