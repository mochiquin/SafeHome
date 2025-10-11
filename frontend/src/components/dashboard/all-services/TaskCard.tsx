import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, DollarSign, User, Calendar, Phone, Zap, Wrench, Home, Zap as ZapIcon, PaintBucket, Car, TreePine } from "lucide-react";
import { useRouter } from "next/navigation";

interface AvailableTaskProps {
  id: string;
  customerId: string;
  serviceName: string;
  serviceType: string;
  serviceCategory: 'cleaning' | 'plumbing' | 'electrical' | 'handyman' | 'painting' | 'gardening';
  description: string;
  date: string;
  time: string;
  price: string;
  address: string;
  status: 'available' | 'claimed' | 'in_progress' | 'completed';
  distance?: string;
}

export const TaskCard = ({
  customerId,
  serviceName,
  serviceType,
  serviceCategory,
  description,
  date,
  time,
  price,
  address,
  status,
  distance
}: AvailableTaskProps) => {
  const router = useRouter();

  const categoryIcons = {
    cleaning: Home,
    plumbing: Wrench,
    electrical: ZapIcon,
    handyman: Wrench,
    painting: PaintBucket,
    gardening: TreePine
  };

  const categoryColors = {
    cleaning: "bg-blue-100 text-blue-800",
    plumbing: "bg-green-100 text-green-800",
    electrical: "bg-yellow-100 text-yellow-800",
    handyman: "bg-purple-100 text-purple-800",
    painting: "bg-orange-100 text-orange-800",
    gardening: "bg-emerald-100 text-emerald-800"
  };

  const CategoryIcon = categoryIcons[serviceCategory] || Home;

  const isAvailable = status === 'available';

  const handleViewDetails = () => {
    router.push(`/dashboard/services?id=${customerId}&view=provider`);
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${!isAvailable ? 'opacity-60' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CategoryIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">{serviceName}</h3>
              <Badge variant="outline" className={categoryColors[serviceCategory]}>
                {serviceCategory.charAt(0).toUpperCase() + serviceCategory.slice(1)}
              </Badge>
              {distance && (
                <Badge variant="secondary" className="text-xs">
                  {distance} away
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{serviceType}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">{price}</p>
            <p className="text-xs text-muted-foreground">per job</p>
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
        </div>

        <div className="flex items-start gap-2 mb-4">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {isAvailable ? (
            <Button className="bg-green-600 hover:bg-green-700">
              <Zap className="h-4 w-4 mr-1" />
              Claim Task
            </Button>
          ) : (
            <Button disabled variant="outline">
              Already Claimed
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleViewDetails}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
