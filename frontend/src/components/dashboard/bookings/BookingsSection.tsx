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
  status: 'confirmed' | 'completed' | 'pending' | 'cancelled';
}

export function BookingsSection() {
  const bookings: BookingCardProps[] = [
    {
      id: "1",
      serviceName: "Professional Home Cleaning",
      serviceType: "Deep Clean Service",
      provider: "CleanPro Services",
      date: "Dec 15, 2024",
      time: "10:00 AM - 12:00 PM",
      price: "$120.00",
      address: "123 Collins Street, Melbourne VIC 3000",
      phone: "+61 3 1234 5678",
      status: "confirmed"
    },
    {
      id: "2",
      serviceName: "Plumbing Repair",
      serviceType: "Emergency Plumbing",
      provider: "QuickFix Plumbing",
      date: "Dec 10, 2024",
      time: "2:00 PM - 4:00 PM",
      price: "$85.00",
      address: "456 Swanston Street, Carlton VIC 3053",
      phone: "+61 3 9876 5432",
      status: "completed"
    },
    {
      id: "3",
      serviceName: "Electrical Inspection",
      serviceType: "Safety Inspection",
      provider: "SafeElectric",
      date: "Dec 20, 2024",
      time: "9:00 AM - 11:00 AM",
      price: "$95.00",
      address: "789 Lygon Street, Brunswick VIC 3056",
      phone: "+61 3 5555 1234",
      status: "pending"
    },
    {
      id: "4",
      serviceName: "Garden Maintenance",
      serviceType: "Lawn Mowing",
      provider: "GreenThumb Gardening",
      date: "Dec 18, 2024",
      time: "8:00 AM - 10:00 AM",
      price: "$65.00",
      address: "321 Smith Street, Fitzroy VIC 3065",
      phone: "+61 3 4444 5678",
      status: "confirmed"
    },
    {
      id: "5",
      serviceName: "House Painting",
      serviceType: "Interior Painting",
      provider: "ColorMasters",
      date: "Dec 22, 2024",
      time: "9:00 AM - 5:00 PM",
      price: "$450.00",
      address: "654 Chapel Street, South Yarra VIC 3141",
      phone: "+61 3 7777 8901",
      status: "pending"
    },
    {
      id: "6",
      serviceName: "Carpet Cleaning",
      serviceType: "Deep Steam Clean",
      provider: "FreshClean",
      date: "Dec 8, 2024",
      time: "11:00 AM - 1:00 PM",
      price: "$110.00",
      address: "987 High Street, Armadale VIC 3143",
      phone: "+61 3 2222 3344",
      status: "completed"
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
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

      <div className="grid gap-6">
        {currentBookings.map((booking) => (
          <BookingCard key={booking.id} {...booking} />
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
    </div>
  );
}
