import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const features = [
  {
    title: "Extensive Collection",
    description:
      "Explore our vast collection of eyeglasses, sunglasses, and contact lenses to find the perfect match for your style and vision needs.",
  },
  {
    title: "Expert Guidance",
    description:
      "Our trained opticians provide personalized recommendations to help you find frames that complement your face shape and lifestyle.",
  },
  {
    title: "Affordable Pricing",
    description:
      "We offer quality eyewear at competitive prices, with options for every budget without compromising on quality.",
  },
  {
    title: "Latest Trends",
    description:
      "Stay fashionable with our regularly updated collection featuring the latest styles and designs from renowned brands.",
  },
  {
    title: "Prescription Expertise",
    description:
      "We specialize in all types of prescriptions, including single vision, bifocals, progressives, and specialty lenses.",
  },
];

function BuyGlassesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Perfect Pair
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our extensive collection of eyewear, from stylish frames to
            prescription lenses, all designed to enhance your vision and
            complement your unique style.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/buy_glasses_section.jpg"
              alt="Customer trying on glasses"
              width={600}
              height={500}
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>

          <div>
            <StickyScroll content={features} />

            <div className="mt-8 space-y-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/category/eyeglasses">Shop Eyeglasses</Link>
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button asChild variant="outline">
                  <Link href="/category/sunglasses">Shop Sunglasses</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/category/lenses">Shop Contact Lenses</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Quality Assurance</h3>
            <p className="text-gray-600">
              All our products meet the highest standards of quality and comfort
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Affordable Pricing</h3>
            <p className="text-gray-600">
              Competitive prices to fit every budget without compromising
              quality
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
            <p className="text-gray-600">
              Our knowledgeable staff is here to assist with all your eyewear
              needs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuyGlassesSection;
