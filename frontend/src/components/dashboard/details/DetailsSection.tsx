import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function DetailsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Details</CardTitle>
        <CardDescription>View your account information and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Account Type</Label>
            <p className="text-sm text-muted-foreground">Customer</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Member Since</Label>
            <p className="text-sm text-muted-foreground">January 2024</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Total Bookings</Label>
            <p className="text-sm text-muted-foreground">12</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Favorite Services</Label>
            <p className="text-sm text-muted-foreground">Cleaning, Plumbing</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preferred Contact Method</Label>
            <p className="text-sm text-muted-foreground">Email & SMS</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Notification Preferences</Label>
            <div className="flex gap-2">
              <Badge variant="outline">Booking Updates</Badge>
              <Badge variant="outline">Promotions</Badge>
              <Badge variant="outline">Service Reminders</Badge>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button variant="outline">Edit Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
