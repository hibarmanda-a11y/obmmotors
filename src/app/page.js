import HeroSection from "@/components/hero/HeroSection";


import CarInventory from "../components/home/CarInventory";
import WhatYouLookingFor from "@/components/home/WhatYouLookingFor";
import HappyCustomers from "@/components/home/HappyCustomers";
import BookAppointmentSection from "@/components/home/BookAppointmentSection";
import WhyWe from "@/components/home/WhyWe";

/**
 * Landing page - Main entry point of the application
 * Features Hero, Categories, Best Deals, Trust Features, Financing, Reviews, Blog and Recently Viewed
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Car Inventory */}
      <CarInventory />

      {/* What You Are Looking For */}
      <WhatYouLookingFor />
      {/* <happy Custoomers */}
      <HappyCustomers />
      {/* Latest Blog Section */}
      {/* Book Appointment */}
      <BookAppointmentSection />

      {/* why we  */}
      <WhyWe />
      {/* Recently Viewed Cars */}
     
    </div>
  );
}
