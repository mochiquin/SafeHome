import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, DollarSign, User, Calendar, Phone, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { Booking } from "@/lib/types/booking";
import { useStartJob } from "@/hooks/use-start-job";

interface ReceivedOrderCardProps {
  booking: Booking;
  onJobStarted?: () => void;
}

export const ReceivedOrderCard = ({ booking, onJobStarted }: ReceivedOrderCardProps) => {
  const { startJob, isLoading } = useStartJob();

  // Format the date and time
  const startDate = new Date(booking.start_time);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const { status, address, phone } = booking;

  const handleStartJob = async () => {
    try {
      await startJob(booking.id);
      onJobStarted?.();
    } catch (error) {
      // Error handled in hook
    }
  };
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-orange-100 text-orange-800 border-orange-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };

  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled"
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{booking.user?.email || 'Customer'}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{booking.service_type_display || booking.service_type}</p>
            <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm text-muted-foreground">{formattedTime} ({booking.duration_hours}h)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">City</p>
              <p className="text-sm text-muted-foreground">{booking.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Contact</p>
              <p className="text-sm text-muted-foreground">{phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        {address && (
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </div>
        )}
        
        {booking.notes && (
          <div className="flex items-start gap-2 mb-4">
            <div>
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm text-muted-foreground">{booking.notes}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {status === 'pending' && (
            <>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button size="sm" variant="outline">
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </>
          )}
          {status === 'confirmed' && (
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleStartJob}
              disabled={isLoading}
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {isLoading ? 'Starting...' : 'Start Job'}
            </Button>
          )}
          {status === 'in_progress' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Complete
            </Button>
          )}
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
