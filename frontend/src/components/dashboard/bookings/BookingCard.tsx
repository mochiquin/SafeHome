import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { MapPin, Clock, DollarSign, User, Calendar, Phone, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { bookingsApi } from "@/lib/apis";
import { toast } from "sonner";

interface BookingCardProps {
  id: string;
  serviceName: string;
  serviceType: string;
  provider: string;
  date: string;
  time: string;
  price: string;
  address: string;
  phone: string;
  status: 'confirmed' | 'completed' | 'pending' | 'cancelled' | 'in_progress';
  onStatusChange?: () => void;
}

export const BookingCard = ({
  id,
  serviceName,
  serviceType,
  provider,
  date,
  time,
  price,
  address,
  phone,
  status,
  onStatusChange
}: BookingCardProps) => {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const statusColors = {
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    in_progress: "bg-orange-100 text-orange-800 border-orange-200"
  };

  const statusLabels = {
    confirmed: "Confirmed",
    completed: "Completed",
    pending: "Pending",
    cancelled: "Cancelled",
    in_progress: "In Progress"
  };

  const handleViewDetails = () => {
    console.log('Navigating to booking detail:', id);
    router.push(`/dashboard/booking/${id}`);
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      const response = await bookingsApi.cancelBooking(id);
      if (response.success) {
        toast.success('Booking cancelled successfully');
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        throw new Error(response.message || 'Failed to cancel booking');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{serviceName}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{serviceType}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Provider: {provider}</span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`${statusColors[status]} font-medium`}
          >
            {statusLabels[status]}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm text-muted-foreground">{time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Price</p>
              <p className="text-sm text-muted-foreground">{price}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Contact</p>
              <p className="text-sm text-muted-foreground">{phone}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 mb-4">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Address</p>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleViewDetails}>
            View Details
          </Button>
          {(status === 'confirmed' || status === 'pending') && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" disabled={isCancelling}>
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
  );
};
