import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Drushti Eye Care",
  description:
    "Welcome to Drushti Eye Care in Kudal! We provide stylish glasses, frames, and lenses at affordable prices. Our friendly team helps you choose the perfect fit. Shop online easily, track orders, and enjoy safe payments. We offer hassle-free returns and real-time stock updates. Trust us for quality eyewear and caring service. Your vision, our priority!",
  keywords: [
    "eye care",
    "glasses",
    "frames",
    "lenses",
    "Kudal",
    "optical shop",
    "eye wear",
    "vision care",
  ],
  authors: [{ name: "Drushti Eye Care" }],
  creator: "Drushti Eye Care",
  publisher: "Drushti Eye Care",
  robots: "index, follow",
  metadataBase: new URL("https://drushti-eye-care.vercel.app"),
  openGraph: {
    title: "Drushti Eye Care - Quality Eye Wear in Kudal",
    description: "Premium eye care services and products at affordable prices",
    images: [{ url: "/logo.jpg" }],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
