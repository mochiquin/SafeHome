import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, DollarSign, User, Calendar, Phone, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ServiceDetailProps {
  searchParams: {
    id?: string;
    view?: 'provider' | 'customer';
  };
}

// Unified service data structure - same service, different perspectives
const mockServiceData = {
  id: "1",
  serviceName: "Professional Home Cleaning",
  serviceType: "Deep Clean Service",
  serviceCategory: "cleaning",
  description: "Need thorough cleaning of 3-bedroom house including kitchen, bathrooms, and living areas. Please bring all necessary cleaning supplies and equipment.",

  // Customer information (visible to providers)
  customerName: "John Smith",
  customerPhone: "+61 3 1234 5678",
  customerEmail: "john.smith@email.com",

  // Provider information (visible to customers)
  providerName: "CleanPro Services",
  providerPhone: "+61 3 9876 5432",

  // Service details
  date: "Dec 15, 2024",
  time: "10:00 AM - 12:00 PM",
  price: "$120.00",
  address: "123 Collins Street, Melbourne VIC 3000",
  distance: "2.3 km", // For providers

  // Customer requirements (for providers)
  requirements: [
    "3-bedroom house",
    "Deep cleaning required",
    "Kitchen appliances included",
    "Bathroom deep clean",
    "All cleaning supplies provided"
  ],

  // Customer notes (for providers)
  notes: "Please bring eco-friendly cleaning products as preferred.",

  // Status can be different based on perspective
  providerStatus: "available", // For provider view
  customerStatus: "confirmed"  // For customer view
};

export default function ServiceDetailPage({ searchParams }: ServiceDetailProps) {
  const { id, view = 'provider' } = searchParams;

  // In real app, fetch data based on ID - same service, different perspectives
  const data = mockServiceData;

  // Current user is viewing as provider or customer
  const isProviderView = view === 'provider';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Link href={isProviderView ? '/dashboard/all-services' : '/dashboard/bookings'}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {isProviderView ? 'Available Tasks' : 'My Bookings'}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{data.serviceName}</CardTitle>
              <CardDescription className="text-base mt-2">
                {data.serviceType}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={`font-medium ${
                isProviderView
                  ? data.providerStatus === 'available'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                  : data.customerStatus === 'confirmed'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : data.customerStatus === 'completed'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
              }`}
            >
              {isProviderView ? data.providerStatus : data.customerStatus}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Service Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">{data.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">{data.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Price</p>
                  <p className="text-muted-foreground">{data.price}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{data.address}</p>
                </div>
              </div>
              {isProviderView && data.distance && (
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Distance</p>
                    <p className="text-muted-foreground">{data.distance} away</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Customer/Provider Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">
              {isProviderView ? 'Customer Information' : 'Service Provider'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-muted-foreground">
                    {isProviderView ? data.customerName : data.providerName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">
                    {isProviderView ? data.customerPhone : data.providerPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements and Notes - shown to providers */}
          {isProviderView && data.requirements && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Requirements</h3>
                <ul className="space-y-1">
                  {data.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Notes - shown to providers */}
          {isProviderView && data.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Additional Notes</h3>
                <p className="text-muted-foreground">{data.notes}</p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <Separator />
          <div className="flex gap-3 pt-4">
            {isProviderView ? (
              <>
                {data.providerStatus === 'available' ? (
                  <Button className="bg-green-600 hover:bg-green-700">
                    Claim This Task
                  </Button>
                ) : (
                  <Button disabled variant="outline">
                    Already Claimed
                  </Button>
                )}
                <Button variant="outline">
                  Contact Customer
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline">
                  Contact Provider
                </Button>
                {data.customerStatus === 'confirmed' && (
                  <>
                    <Button variant="outline">
                      Reschedule
                    </Button>
                    <Button variant="destructive">
                      Cancel Booking
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
