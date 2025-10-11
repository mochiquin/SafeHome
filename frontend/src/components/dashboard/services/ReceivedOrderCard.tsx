import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, DollarSign, User, Calendar, Phone, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ReceivedOrderCardProps {
  id: string;
  customerName: string;
  serviceName: string;
  serviceType: string;
  date: string;
  time: string;
  price: string;
  address: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}

export const ReceivedOrderCard = ({
  customerName,
  serviceName,
  serviceType,
  date,
  time,
  price,
  address,
  phone,
  status
}: ReceivedOrderCardProps) => {
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
              <h3 className="font-semibold text-lg">{customerName}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{serviceName} - {serviceType}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">{price}</p>
            <p className="text-xs text-muted-foreground">earned</p>
          </div>
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
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <AlertCircle className="h-4 w-4 mr-1" />
              Start Job
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
