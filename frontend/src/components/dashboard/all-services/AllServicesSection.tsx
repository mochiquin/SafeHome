import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search } from "lucide-react";
import { TaskCard } from "./TaskCard";

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

export function AllServicesSection() {
  const availableTasks: AvailableTaskProps[] = [
    {
      id: "1",
      customerId: "cust_001",
      serviceName: "Professional Home Cleaning",
      serviceType: "Deep Clean Service",
      serviceCategory: "cleaning",
      description: "Need thorough cleaning of 3-bedroom house including kitchen, bathrooms, and living areas.",
      date: "Dec 15, 2024",
      time: "10:00 AM - 12:00 PM",
      price: "$120.00",
      address: "123 Collins Street, Melbourne VIC 3000",
      status: "available",
      distance: "2.3 km"
    },
    {
      id: "2",
      customerId: "cust_002",
      serviceName: "Plumbing Repair",
      serviceType: "Emergency Plumbing",
      serviceCategory: "plumbing",
      description: "Kitchen sink is completely blocked. Water backing up. Need immediate assistance.",
      date: "Dec 16, 2024",
      time: "ASAP",
      price: "$150.00",
      address: "456 Swanston Street, Carlton VIC 3053",
      status: "available",
      distance: "1.8 km"
    },
    {
      id: "3",
      customerId: "cust_003",
      serviceName: "Electrical Inspection",
      serviceType: "Safety Inspection",
      serviceCategory: "electrical",
      description: "Annual electrical safety check for rental property. Need certified electrician.",
      date: "Dec 17, 2024",
      time: "2:00 PM - 4:00 PM",
      price: "$95.00",
      address: "789 Lygon Street, Brunswick VIC 3056",
      status: "available",
      distance: "4.2 km"
    },
    {
      id: "4",
      customerId: "cust_004",
      serviceName: "Garden Maintenance",
      serviceType: "Lawn Mowing",
      serviceCategory: "gardening",
      description: "Large backyard needs mowing and edging. Also need hedges trimmed.",
      date: "Dec 18, 2024",
      time: "9:00 AM - 11:00 AM",
      price: "$75.00",
      address: "321 Smith Street, Fitzroy VIC 3065",
      status: "available",
      distance: "3.1 km"
    },
    {
      id: "5",
      customerId: "cust_005",
      serviceName: "House Painting",
      serviceType: "Interior Painting",
      serviceCategory: "painting",
      description: "Need living room and bedroom painted. Paint and materials provided.",
      date: "Dec 20, 2024",
      time: "8:00 AM - 5:00 PM",
      price: "$450.00",
      address: "654 Chapel Street, South Yarra VIC 3141",
      status: "available",
      distance: "5.7 km"
    },
    {
      id: "6",
      customerId: "cust_006",
      serviceName: "Carpet Cleaning",
      serviceType: "Deep Steam Clean",
      serviceCategory: "cleaning",
      description: "3-bedroom house carpet cleaning. Need professional equipment and eco-friendly products.",
      date: "Dec 19, 2024",
      time: "11:00 AM - 2:00 PM",
      price: "$180.00",
      address: "987 High Street, Armadale VIC 3143",
      status: "claimed",
      distance: "6.2 km"
    },
    {
      id: "7",
      customerId: "cust_007",
      serviceName: "Handyman Services",
      serviceType: "General Repairs",
      serviceCategory: "handyman",
      description: "Need help fixing door hinges, installing shelves, and minor plumbing adjustments.",
      date: "Dec 21, 2024",
      time: "1:00 PM - 3:00 PM",
      price: "$90.00",
      address: "147 Bourke Street, Melbourne VIC 3000",
      status: "available",
      distance: "1.5 km"
    },
    {
      id: "8",
      customerId: "cust_008",
      serviceName: "Electrical Installation",
      serviceType: "Light Fixtures",
      serviceCategory: "electrical",
      description: "Need to install new ceiling lights in living room and dining area. Have fixtures ready.",
      date: "Dec 22, 2024",
      time: "10:00 AM - 12:00 PM",
      price: "$110.00",
      address: "258 Flinders Lane, Melbourne VIC 3000",
      status: "available",
      distance: "2.1 km"
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const itemsPerPage = 4;

  // Filter tasks based on search and category
  const filteredTasks = availableTasks.filter(task => {
    const matchesSearch = task.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "all" || task.serviceCategory === categoryFilter;

    return matchesSearch && matchesCategory && task.status === 'available';
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

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
          <CardTitle>Available Tasks</CardTitle>
          <CardDescription>Claim tasks from customers. Browse and filter by service category to find work that matches your skills.</CardDescription>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={categoryFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("all")}
              >
                All
              </Button>
              <Button
                variant={categoryFilter === "cleaning" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("cleaning")}
              >
                Cleaning
              </Button>
              <Button
                variant={categoryFilter === "plumbing" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("plumbing")}
              >
                Plumbing
              </Button>
              <Button
                variant={categoryFilter === "electrical" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("electrical")}
              >
                Electrical
              </Button>
              <Button
                variant={categoryFilter === "handyman" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("handyman")}
              >
                Handyman
              </Button>
              <Button
                variant={categoryFilter === "painting" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("painting")}
              >
                Painting
              </Button>
              <Button
                variant={categoryFilter === "gardening" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("gardening")}
              >
                Gardening
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="grid gap-6">
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No tasks match your current filters.</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
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
        Showing {startIndex + 1}-{Math.min(endIndex, filteredTasks.length)} of {filteredTasks.length} available tasks
      </div>
    </div>
  );
}
