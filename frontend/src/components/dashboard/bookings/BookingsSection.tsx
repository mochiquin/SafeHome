import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BookingCard } from "./BookingCard";
import { useUserBookings } from "@/hooks/use-user-bookings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
}

export function BookingsSection() {
  const { bookings: apiBookings, isLoading, error, refetch } = useUserBookings();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Transform API bookings to BookingCardProps format
  const bookings: BookingCardProps[] = apiBookings.map(booking => {
    const startDate = new Date(booking.start_time);
    const endDate = new Date(startDate.getTime() + booking.duration_hours * 60 * 60 * 1000);
    
    return {
      id: booking.id,
      serviceName: booking.service_type_display || booking.service_type,
      serviceType: booking.service_type_display || booking.service_type,
      provider: booking.provider 
        ? `${booking.provider.first_name || ''} ${booking.provider.last_name || ''}`.trim() || booking.provider.email
        : 'Waiting for provider',
      date: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: `${startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      price: booking.budget ? `$${Number(booking.budget).toFixed(2)}` : 'TBD',
      address: booking.address || 'N/A',
      phone: booking.phone || 'N/A',
      status: booking.status as 'confirmed' | 'completed' | 'pending' | 'cancelled' | 'in_progress'
    };
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>Loading your bookings...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
      </Alert>
    );
  }
  const itemsPerPage = 3;

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
      }
    }

    return pageNumbers.map((page) => (
      <PaginationItem key={page}>
        <PaginationLink
          onClick={() => handlePageChange(page)}
          isActive={currentPage === page}
          className="cursor-pointer"
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>View and manage your service bookings.</CardDescription>
        </CardHeader>
      </Card>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold">No bookings yet</h3>
              <p className="text-muted-foreground mt-2">You haven't created any service bookings yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6">
            {currentBookings.map((booking) => (
              <BookingCard key={booking.id} {...booking} onStatusChange={refetch} />
            ))}
          </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {renderPageNumbers()}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(totalPages)}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

          <div className="text-center text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, bookings.length)} of {bookings.length} bookings
          </div>
        </>
      )}
    </div>
  );
}
