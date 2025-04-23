import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CardSpotlight } from "@/components/ui/card-spotlight";

const categories = [
  {
    id: "eyeglasses",
    name: "Eyeglasses",
    description:
      "Find the perfect frames to match your style and prescription needs",
    image:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "sunglasses",
    name: "Sunglasses",
    description:
      "Protect your eyes in style with our premium sunglasses collection",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "contact-lenses",
    name: "Contact Lenses",
    description:
      "Comfortable and clear vision with our range of contact lenses",
    image:
      "https://images.unsplash.com/photo-1587400061700-9cdad9f2bceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Essential accessories for eyewear maintenance and care",
    image:
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  },
];

export default function CategoryPage() {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Browse Our Collections
      </h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Explore our wide range of eyewear products designed to meet your vision
        needs and style preferences. Find the perfect match for your face shape
        and personal style.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="no-underline"
          >
            <CardSpotlight className="h-full overflow-hidden">
              <div className="relative z-20">
                <div className="h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6 text-white">
                  <h3 className="font-semibold text-xl mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                  <div className="mt-4 flex justify-end">
                    <span className="text-blue-600 flex items-center">
                      Browse Collection
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </CardSpotlight>
          </Link>
        ))}
      </div>
    </div>
  );
}
