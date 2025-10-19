import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, User, Calendar, CheckCircle } from "lucide-react";
import type { Booking } from "@/lib/types/booking";

interface AvailableTaskCardProps {
  task: Booking;
  onAccept: (taskId: string) => Promise<boolean>;
}

export const AvailableTaskCard = ({ task, onAccept }: AvailableTaskCardProps) => {
  const [isAccepting, setIsAccepting] = useState(false);

  // Format the date and time
  const startDate = new Date(task.start_time);
  const formattedDate = startDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleAccept = async () => {
    setIsAccepting(true);
    await onAccept(task.id);
    setIsAccepting(false);
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{task.user?.email || 'Customer'}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{task.service_type_display || task.service_type}</p>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Available</Badge>
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
              <p className="text-sm text-muted-foreground">{formattedTime} ({task.duration_hours}h)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{task.city}, {task.state || task.country}</p>
            </div>
          </div>
        </div>

        {task.notes && (
          <div className="flex items-start gap-2 mb-4">
            <div>
              <p className="text-sm font-medium">Customer Notes</p>
              <p className="text-sm text-muted-foreground">{task.notes}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleAccept}
            disabled={isAccepting}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {isAccepting ? 'Accepting...' : 'Accept Task'}
          </Button>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

