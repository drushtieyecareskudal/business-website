"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner"; // Changed to import from sonner

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    rating: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const maps = [
    {
      label: "Kudal Main Branch",
      url: "https://www.google.com/maps/embed?pb=!1m18!...", // replace with actual embed URLs
    },
    {
      label: "Sawantwadi",
      url: "https://www.google.com/maps/embed?pb=!1m18!...",
    },
    {
      label: "Vengurla",
      url: "https://www.google.com/maps/embed?pb=!1m18!...",
    },
    {
      label: "Malvan",
      url: "https://www.google.com/maps/embed?pb=!1m18!...",
    },
  ];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Using sonner toast instead
    toast("Message sent!", {
      description: "Thank you for reaching out. We'll get back to you shortly.",
      action: {
        label: "Close",
        onClick: () => console.log("Toast closed"),
      },
    });

    // Clear the form
    const form = event.target as HTMLFormElement;
    form.reset();
  };

  // Rest of your component remains the same
  return (
    <div className="bg-white text-gray-900 px-4 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">
          Contact Drushti Eye Care
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
          For appointments, product inquiries, or any questions, we’re here to
          help. Reach out to us through the form below or visit any of our
          branches.
        </p>
      </div>

      {/* Contact Info + Form */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Info Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Main Office</h2>
            <p>Drushti Eye Care, Kudal Main Road, Kudal, Maharashtra 416520</p>
          </div>
          <div>
            <h3 className="font-medium">Phone:</h3>
            <p className="text-muted-foreground">+91 98765 43210</p>
          </div>
          <div>
            <h3 className="font-medium">Email:</h3>
            <p className="text-muted-foreground">contact@drushtieyecare.in</p>
          </div>
          <div>
            <h3 className="font-medium">Hours:</h3>
            <p className="text-muted-foreground">
              Mon – Sat: 9:00 AM – 8:00 PM
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Your Message / Feedback</Label>
            <Textarea
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              name="rating"
              type="number"
              min="1"
              max="5"
              value={form.rating}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full md:w-auto">
            Submit
          </Button>
        </form>
      </div>

      <Separator className="my-12" />

      {/* Locations */}
      <div>
        <h2 className="text-2xl font-semibold text-center mb-8">
          Our Locations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {maps.map((map, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-semibold">{map.label}</h3>
              <div className="rounded-lg overflow-hidden border">
                <iframe
                  src={map.url}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
