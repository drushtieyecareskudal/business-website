"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function FeedbackPage() {
  const [rating, setRating] = useState<number | null>(null);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (rating === null) {
      toast.error("Rating required", {
        description: "Please provide a rating before submitting your feedback.",
      });
      return;
    }

    // In a real implementation, you would send this data to your backend
    toast.success("Feedback submitted!", {
      description: "Thank you for sharing your experience with us.",
    });

    // Reset form and rating
    setRating(null);
    const form = event.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Customer Feedback</h1>
        <p className="text-xl text-gray-600">
          Your opinion matters! Help us improve our services by sharing your
          experience.
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rest of the form remains unchanged */}
          {/* ... */}

          {/* Form content remains the same */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Your Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingClick(value)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    rating === value
                      ? "bg-blue-600 text-white"
                      : rating !== null && value <= rating
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <span className="text-xl">{value}</span>
                </button>
              ))}
              <span className="ml-3 text-gray-500">
                {rating ? `${rating} out of 5` : "Select rating"}
              </span>
            </div>
          </div>

          {/* Rest of the form fields */}
          <div className="space-y-2">
            <Label htmlFor="visitedStore">Which store did you visit?</Label>
            <Input id="visitedStore" placeholder="Kudal Store" required />
          </div>

          {/* ... other form fields ... */}

          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </div>
    </div>
  );
}
