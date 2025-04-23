import React from "react";
import HomeCarousel from "@/components/HomeCarousel";
import BestQualitySection from "@/components/BestQualitySection";
import BuyGlassesSection from "@/components/BuyGlassesSection";
import OffersSection from "@/components/OffersSection";
import OwnerMessageSection from "@/components/OwnerMessageSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      {/* Hero Carousel */}
      <HomeCarousel />

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-lg font-medium mb-4 md:mb-0">
            Schedule an eye examination today and get 20% off on your first
            purchase!
          </p>
          <Button variant="secondary" asChild>
            <Link href="/contact">Book Appointment</Link>
          </Button>
        </div>
      </div>

      {/* Best Quality Section */}
      <BestQualitySection />

      {/* Buy Glasses Section */}
      <BuyGlassesSection />

      {/* Offers Section */}
      <OffersSection />

      {/* Owner Message Section */}
      <OwnerMessageSection />

      {/* Call to Action */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Pair?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Visit our store today or explore our collections online. We're
            committed to helping you find eyewear that suits your style,
            prescription, and budget.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/category">Browse Collections</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
