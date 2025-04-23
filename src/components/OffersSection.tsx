import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const offers = [
  {
    title: "Buy 1 Get 1 Free",
    description:
      "Purchase any premium frame and get a second frame of equal or lesser value free.",
    code: "BOGO2025",
    expiryDate: "April 30, 2025",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "30% Off All Sunglasses",
    description:
      "Get ready for summer with 30% off our entire collection of branded sunglasses.",
    code: "SUMMER30",
    expiryDate: "May 15, 2025",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    title: "Free Eye Test",
    description:
      "Book a comprehensive eye examination at no cost with any frame purchase.",
    code: "FREETEST",
    expiryDate: "Ongoing",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
];

function OffersSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Special Offers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take advantage of our limited-time offers and exclusive deals to
            save on your eyewear purchase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`${offer.bgColor} ${offer.borderColor} border-2 rounded-lg p-6 shadow-sm relative overflow-hidden`}
            >
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-white opacity-10 rounded-full"></div>

              <h3 className="text-xl font-bold mb-3">{offer.title}</h3>
              <p className="text-gray-700 mb-4">{offer.description}</p>

              <div className="bg-white p-3 rounded-md mb-4 flex items-center justify-between">
                <span className="text-gray-500 font-medium">Code:</span>
                <span className="font-bold text-blue-600">{offer.code}</span>
              </div>

              <p className="text-sm text-gray-500 mb-5">
                Valid until: {offer.expiryDate}
              </p>

              <Button asChild variant="outline" className="w-full">
                <Link href="/category">Redeem Now</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-600 text-white p-8 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-2">
                First-Time Customer? Get 15% Off!
              </h3>
              <p>
                Sign up for our newsletter and receive a 15% discount on your
                first purchase.
              </p>
            </div>
            <div>
              <Button asChild variant="secondary" size="lg" className="w-full">
                <Link href="/contact">Subscribe Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OffersSection;
