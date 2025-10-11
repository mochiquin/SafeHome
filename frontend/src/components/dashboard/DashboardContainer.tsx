"use client";

import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { ProfileSection } from "./profile";
import { BookingsSection } from "./bookings";
import { ServicesSection } from "./services";
import { AllServicesSection } from "./all-services";
import { NewBookingSection } from "./new-booking";
import { DetailsSection } from "./details";

interface DashboardContainerProps {
  userType?: 'customer' | 'provider';
}

export function DashboardContainer({ userType = 'customer' }: DashboardContainerProps) {
  const [activeSection, setActiveSection] = useState("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />;
      case "details":
        return <DetailsSection />;
      case "bookings":
        return userType === 'customer' ? <BookingsSection /> : <ServicesSection />;
      case "new-booking":
        return userType === 'customer' ? <NewBookingSection /> : null;
      case "all-services":
        return userType === 'provider' ? <AllServicesSection /> : null;
      case "services":
        return userType === 'provider' ? <ServicesSection /> : <BookingsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="bg-background">
      <DashboardHeader />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row">
          <DashboardSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            userType={userType}
          />

          <main className="flex-1">
            <div className="container mx-auto px-0 py-4 md:py-6 md:pl-6">
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
