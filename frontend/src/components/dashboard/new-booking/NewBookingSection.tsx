import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, DollarSign, MapPin, FileText, Send, Search } from "lucide-react";
import { useNewBooking } from "@/hooks/use-new-booking";
import type { ServiceType } from "@/lib/types/booking";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormData } from "@/lib/validations/booking";
import { toast } from "sonner";
import { CovidBanner } from "@/components/covid/CovidBanner";
import { SimpleMap } from "@/components/maps";
import { useState } from "react";

export function NewBookingSection() {
  const { createBooking, isSubmitting } = useNewBooking();
  const [searchLocation, setSearchLocation] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service_type: undefined,
      budget: '',
      date: '',
      time: '',
      duration: '',
      address: '',
      city: '',
      phone: '',
      description: '',
    },
  });

  const serviceType = watch('service_type');
  const duration = watch('duration');
  const city = watch('city');
  const address = watch('address');

  // Handle search button click - Auto-fill city from address
  const handleSearch = async () => {
    if (!address) {
      toast.error('Please enter an address');
      return;
    }

    try {
      toast.info('Searching location...');

      // Use Google Maps Geocoding API to get city from address
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
      if (!apiKey) {
        toast.error('Google Maps API key not configured');
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results[0]) {
        const result = data.results[0];
        
        // Extract city from address components
        let cityName = '';
        for (const component of result.address_components) {
          if (component.types.includes('locality')) {
            cityName = component.long_name;
            break;
          }
          // Fallback to administrative_area_level_2 if locality not found
          if (component.types.includes('administrative_area_level_2') && !cityName) {
            cityName = component.long_name;
          }
        }

        if (cityName) {
          // Auto-fill city field
          setValue('city', cityName);
          toast.success(`City detected: ${cityName}`);
          
          // Set search location for map
          const searchQuery = `${address}, ${cityName}`;
          setSearchLocation(searchQuery);
        } else {
          toast.warning('Could not detect city from address');
          const searchQuery = city ? `${address}, ${city}` : address;
          setSearchLocation(searchQuery);
        }
      } else {
        toast.error('Could not find location. Please check the address.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to search location');
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      // Combine date and time
      const localDateTime = new Date(`${data.date}T${data.time}`);
      const startTime = localDateTime.toISOString();
      const durationHours = parseInt(data.duration) / 60; // Convert minutes to hours

      const success = await createBooking({
        service_type: data.service_type as ServiceType,
        budget: data.budget ? parseFloat(data.budget) : undefined,
        address: data.address,
        phone: data.phone,
        city: data.city,
        state: '',
        country: 'AU',
        start_time: startTime,
        duration_hours: durationHours,
        notes: data.description || undefined,
      });

      if (success) {
        // Reset form to default values on success
        reset();
        toast.success('Booking created successfully! Redirecting to your bookings...');
      } else {
        toast.error('Failed to create booking. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="service" className="text-sm font-medium">
              Service Type *
            </Label>
            <Select value={serviceType} onValueChange={(value) => setValue('service_type', value as any)}>
              <SelectTrigger className={errors.service_type ? "border-red-500" : ""}>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cleaning">Home Cleaning</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="gardening">Gardening</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.service_type && (
              <p className="text-sm text-red-500">{errors.service_type.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-medium">
              Budget (AUD)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="budget"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`pl-10 ${errors.budget ? "border-red-500" : ""}`}
                {...register('budget')}
              />
            </div>
            {errors.budget && (
              <p className="text-sm text-red-500">{errors.budget.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Preferred Schedule
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                min={today}
                className={errors.date ? "border-red-500" : ""}
                {...register('date')}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Start Time *
              </Label>
              <Input
                id="time"
                type="time"
                className={errors.time ? "border-red-500" : ""}
                {...register('time')}
              />
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration *
              </Label>
              <Select value={duration} onValueChange={(value) => setValue('duration', value)}>
                <SelectTrigger className={errors.duration ? "border-red-500" : ""}>
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
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Service Description
          </Label>
          <Textarea
            id="description"
            placeholder="Please describe the service you need in detail. Include any specific requirements, preferences, or important information that service providers should know."
            rows={4}
            {...register('description')}
          />
        </div>

        {/* Map Location Section */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Service Location
          </Label>
          <div className="space-y-4">
            {/* Address input with Search button */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  placeholder="Enter your full address"
                  className={`flex-1 ${errors.address ? "border-red-500" : ""}`}
                  {...register('address')}
                />
                <Button
                  type="button"
                  variant="default"
                  onClick={handleSearch}
                  disabled={isSubmitting || !address}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* City and Phone in one row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City *
                </Label>
                <Input
                  id="city"
                  placeholder="Enter city"
                  className={errors.city ? "border-red-500" : ""}
                  {...register('city')}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+61 XXX XXX XXX"
                  className={errors.phone ? "border-red-500" : ""}
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* COVID Restriction Banner - Only show when city is entered */}
            {city && city.trim().length > 0 && (
              <div className="mt-4">
                <CovidBanner country="AU" city={city.trim().replace(/\/+$/, '')} />
              </div>
            )}

            {/* Google Map - Use searchLocation if search was clicked */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Location on Map
              </Label>
              {searchLocation ? (
                <SimpleMap 
                  address={searchLocation} 
                  height="300px" 
                />
              ) : (
                <div className="w-full h-[300px] bg-muted/30 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Enter address and click Search to view map</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Booking'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
