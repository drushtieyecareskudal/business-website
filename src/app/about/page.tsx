import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ContactInfo } from "@/utils/globas";

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Drushti Eye Care</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted partner for all your eye care and eyewear needs since
          2010
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2010, Drushti Eye Care has been a cornerstone of eye
            health and quality eyewear in Kudal. What started as a small optical
            shop has grown into a comprehensive eye care center, offering
            everything from eye examinations to designer frames.
          </p>
          <p className="text-gray-700 mb-4">
            Our journey has been guided by a simple philosophy - prioritize
            customer satisfaction and provide exceptional quality products at
            fair prices. This commitment has earned us the trust of thousands of
            satisfied customers over the years.
          </p>
          <p className="text-gray-700">
            Today, we continue to stay at the forefront of eye care technology
            and fashion trends, bringing you the best selection of eyewear
            combined with expert care and advice.
          </p>
          <p className="text-gray-500 text-right">-{ContactInfo.name}</p>
        </div>
        <div className="relative">
          <Image
            src="/owner.jpg"
            alt="Drushti Eye Care Owner"
            width={600}
            height={400}
            className="rounded-lg shadow-md w-full h-auto"
          />
        </div>
      </div>

      <Separator className="my-16" />

      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Expertise */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Expert Guidance</h3>
            <p className="text-gray-600">
              Our team of experienced opticians provides personalized advice to
              help you find the perfect eyewear that suits your style, budget,
              and vision needs.
            </p>
          </div>

          {/* Quality */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-green-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Premium Quality</h3>
            <p className="text-gray-600">
              We source our products from reputable manufacturers, ensuring that
              every pair of glasses, contacts, or accessories meets the highest
              standards of quality.
            </p>
          </div>

          {/* Affordability */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-600"
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
            <h3 className="font-semibold text-xl mb-3">Competitive Pricing</h3>
            <p className="text-gray-600">
              We believe good vision should be accessible to all. That&apos;s
              why we offer a range of products at various price points without
              compromising on quality.
            </p>
          </div>

          {/* Customer Service */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-yellow-600"
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
            <h3 className="font-semibold text-xl mb-3">Outstanding Service</h3>
            <p className="text-gray-600">
              Our commitment to customer satisfaction extends beyond the sale.
              We provide ongoing support, adjustments, and maintenance for all
              your eyewear.
            </p>
          </div>

          {/* Selection */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Wide Selection</h3>
            <p className="text-gray-600">
              From classic styles to the latest fashion trends, we offer a
              diverse collection of eyewear to cater to different tastes,
              preferences, and needs.
            </p>
          </div>

          {/* Technology */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="bg-indigo-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-3">Advanced Technology</h3>
            <p className="text-gray-600">
              We invest in the latest optical technology to provide accurate
              prescriptions, precise measurements, and high-quality lens
              customization.
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-16" />

      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Our Team</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Meet the dedicated professionals who work tirelessly to provide you
          with the best eye care experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Dr. Ajay Sharma"
              width={200}
              height={200}
              className="rounded-full mx-auto shadow-md"
            />
            <h3 className="mt-4 text-xl font-semibold">Dr. Ajay Sharma</h3>
            <p className="text-gray-600">Lead Optometrist</p>
          </div>

          <div className="text-center">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Priya Desai"
              width={200}
              height={200}
              className="rounded-full mx-auto shadow-md"
            />
            <h3 className="mt-4 text-xl font-semibold">Priya Desai</h3>
            <p className="text-gray-600">Senior Optician</p>
          </div>

          <div className="text-center">
            <Image
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Rahul Patel"
              width={200}
              height={200}
              className="rounded-full mx-auto shadow-md"
            />
            <h3 className="mt-4 text-xl font-semibold">Rahul Patel</h3>
            <p className="text-gray-600">Frame Stylist</p>
          </div>
        </div>
      </div>
    </div>
  );
}
