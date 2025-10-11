import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, DollarSign, MapPin, FileText, Send } from "lucide-react";

export function NewBookingSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Booking</CardTitle>
          <CardDescription>
            Create a new service booking request. Fill in the details below and we'll connect you with the right service provider.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="service" className="text-sm font-medium">
              Service Type
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cleaning">Home Cleaning</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="handyman">Handyman</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
                <SelectItem value="gardening">Gardening</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Budget (AUD)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Preferred Schedule
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-time" className="text-sm font-medium">
                Start Time
              </Label>
              <Input
                id="start-time"
                type="time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="180">3 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="300">5 hours</SelectItem>
                  <SelectItem value="360">6 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Service Description
            </Label>
            <Textarea
              id="description"
              placeholder="Please describe the service you need in detail. Include any specific requirements, preferences, or important information that service providers should know."
              rows={4}
            />
          </div>
        </div>

        {/* Map Location Section */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Service Location
          </Label>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Enter your full address including suburb and postcode"
              />
            </div>

            {/* Map Placeholder */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Location on Map
              </Label>
              <div className="w-full h-48 bg-muted/30 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Map integration coming soon</p>
                  <p className="text-xs">Your selected location will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Confirm and Pay
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
