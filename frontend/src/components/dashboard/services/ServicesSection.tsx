import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ReceivedOrderCard } from "./ReceivedOrderCard";


export function ServicesSection() {
  const receivedOrders = [
    {
      id: "1",
      customerName: "Sarah Johnson",
      serviceName: "Professional Home Cleaning",
      serviceType: "Deep Clean Service",
      date: "Dec 15, 2024",
      time: "10:00 AM - 12:00 PM",
      price: "$120.00",
      address: "123 Collins Street, Melbourne VIC 3000",
      phone: "+61 3 1234 5678",
      status: "confirmed",
    },
    {
      id: "2",
      customerName: "Mike Chen",
      serviceName: "Plumbing Repair",
      serviceType: "Emergency Plumbing",
      date: "Dec 16, 2024",
      time: "2:00 PM - 4:00 PM",
      price: "$85.00",
      address: "456 Swanston Street, Carlton VIC 3053",
      phone: "+61 3 9876 5432",
      status: "confirmed",
    },
    {
      id: "3",
      customerName: "Emma Wilson",
      serviceName: "Electrical Inspection",
      serviceType: "Safety Inspection",
      date: "Dec 17, 2024",
      time: "9:00 AM - 11:00 AM",
      price: "$95.00",
      address: "789 Lygon Street, Brunswick VIC 3056",
      phone: "+61 3 5555 1234",
      status: "in_progress",
    },
    {
      id: "4",
      customerName: "David Brown",
      serviceName: "Garden Maintenance",
      serviceType: "Lawn Mowing",
      date: "Dec 18, 2024",
      time: "8:00 AM - 10:00 AM",
      price: "$65.00",
      address: "321 Smith Street, Fitzroy VIC 3065",
      phone: "+61 3 4444 5678",
      status: "completed",
    },
    {
      id: "5",
      customerName: "Lisa Wang",
      serviceName: "House Painting",
      serviceType: "Interior Painting",
      date: "Dec 19, 2024",
      time: "9:00 AM - 5:00 PM",
      price: "$380.00",
      address: "147 Bourke Street, Melbourne VIC 3000",
      phone: "+61 3 6666 7890",
      status: "confirmed",
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(receivedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = receivedOrders.slice(startIndex, endIndex);

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
          <CardTitle>Received Orders</CardTitle>
          <CardDescription>Manage your accepted orders from customers. Track progress and update job status.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {currentOrders.map((order) => (
          <ReceivedOrderCard key={order.id} {...order} />
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
        Showing {startIndex + 1}-{Math.min(endIndex, receivedOrders.length)} of {receivedOrders.length} orders
      </div>
    </div>
  );
}
