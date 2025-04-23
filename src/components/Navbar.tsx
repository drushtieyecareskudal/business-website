"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const navbarHeight = scrolled ? "66px" : "98px"; // Approximate heights when scrolled/not scrolled
  const { user, loading: authLoading, logout } = useAuth();

  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch cart items when user is logged in
  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        try {
          const response = await fetch("/api/cart", {
            method: "GET",
          });

          if (response.ok) {
            const data = await response.json();
            // Calculate total items in cart
            let totalItems = 0;
            if (data.cart && data.cart.items) {
              data.cart.items.forEach((item: any) => {
                totalItems += item.quantity;
              });
            }
            setCartCount(totalItems);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartItems();
  }, [user]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setCategoryDropdown(false);
    setSearchOpen(false);
  }, [pathname]);

  // Check if current path is active
  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (searchOpen) setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (isOpen) setIsOpen(false);
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdown(!categoryDropdown);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
  };

  return (
    <>
      <div
        style={{ height: navbarHeight }}
        className="w-full"
        aria-hidden="true"
      />
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md py-2"
            : "bg-white/80 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative h-12 w-12 md:h-14 md:w-14">
                  <Image
                    src="/logo.jpg"
                    alt="Drushti Eye Care Logo"
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg md:text-xl text-blue-600">
                    Drushti Eye Care
                  </h1>
                  <p className="text-xs text-gray-500">
                    Your vision is our mission
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActivePath("/") ? "text-blue-600" : "text-gray-700"
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActivePath("/about") ? "text-blue-600" : "text-gray-700"
                }`}
              >
                About
              </Link>

              {/* Category Dropdown */}
              <div className="relative group">
                <button
                  className={`flex items-center text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname.startsWith("/category")
                      ? "text-blue-600"
                      : "text-gray-700"
                  }`}
                  onClick={(e) => e.preventDefault()}
                >
                  Shop
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="ml-1 transition-transform group-hover:rotate-180"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-2">
                    <Link
                      href="/category"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      All Categories
                    </Link>
                    <Link
                      href="/category/eyeglasses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      Eyeglasses
                    </Link>
                    <Link
                      href="/category/sunglasses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      Sunglasses
                    </Link>
                    <Link
                      href="/category/lenses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      Contact Lenses
                    </Link>
                    <Link
                      href="/category/accessories"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      Accessories
                    </Link>
                    <Link
                      href="/category/eyeglasses?filter=kids"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    >
                      Kids Collection
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/contact"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActivePath("/contact") ? "text-blue-600" : "text-gray-700"
                }`}
              >
                Contact
              </Link>
              <Link
                href="/faq"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActivePath("/faq") ? "text-blue-600" : "text-gray-700"
                }`}
              >
                FAQs
              </Link>
              <Link
                href="/feedback"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActivePath("/feedback") ? "text-blue-600" : "text-gray-700"
                }`}
              >
                Feedback
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={toggleSearch}
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                  aria-label="Search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>

                {searchOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-3 z-50">
                    <form className="flex">
                      <Input
                        type="text"
                        placeholder="Search for products..."
                        className="rounded-r-none focus-visible:ring-0"
                        autoFocus
                      />
                      <Button
                        variant="default"
                        size="sm"
                        className="rounded-l-none text-white"
                      >
                        Search
                      </Button>
                    </form>
                  </div>
                )}
              </div>

              {/* Authentication */}
              {!authLoading && (
                <div className="relative group">
                  {user ? (
                    <button
                      className="flex items-center space-x-1 rounded-full p-2 hover:bg-blue-100 transition-colors"
                      aria-label="User Menu"
                    >
                      <span className="text-sm font-medium">
                        {user.name.split(" ")[0]}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="transition-transform group-hover:rotate-180"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </button>
                  ) : (
                    <Link href="/login">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Sign In
                      </Button>
                    </Link>
                  )}

                  {/* User dropdown menu */}
                  {user && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b">
                          Signed in as{" "}
                          <span className="font-medium text-gray-700">
                            {user.email}
                          </span>
                        </div>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Button with count */}
              <Link href="/cart">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium focus:ring-1 focus:ring-blue-200 relative">
                  Cart
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 lg:hidden">
              {/* Authentication for mobile */}
              {!authLoading && !user && (
                <Link
                  href="/login"
                  className="text-sm text-blue-600 font-medium"
                >
                  Sign In
                </Link>
              )}

              {/* Cart icon for mobile */}
              <Link href="/cart" className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>

              <button
                onClick={toggleMenu}
                className="p-2 rounded-md hover:bg-blue-100 transition-colors focus:outline-none"
                aria-label={isOpen ? "Close Menu" : "Open Menu"}
              >
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Input */}
          {searchOpen && (
            <div className="py-4 px-2 lg:hidden">
              <form className="flex">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="rounded-r-none focus-visible:ring-0"
                  autoFocus
                />
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-l-none text-white"
                >
                  Search
                </Button>
              </form>
            </div>
          )}

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <nav className="bg-white lg:hidden mt-3 py-4 border-t">
              <div className="flex flex-col space-y-3">
                {/* User info for mobile */}
                {user && (
                  <div className="px-4 py-3 bg-blue-50 rounded-lg mb-2">
                    <p className="text-sm font-medium">Welcome, {user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <div className="flex mt-2 space-x-2">
                      <Link
                        href="/account"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        My Account
                      </Link>
                      <span className="text-gray-400">|</span>
                      <button
                        onClick={handleLogout}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}

                <Link
                  href="/"
                  className={`px-4 py-2 text-sm font-medium ${
                    isActivePath("/")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={`px-4 py-2 text-sm font-medium ${
                    isActivePath("/about")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>

                {/* Mobile Category Menu */}
                <div>
                  <button
                    onClick={toggleCategoryDropdown}
                    className={`flex justify-between items-center w-full px-4 py-2 text-sm font-medium ${
                      pathname.startsWith("/category")
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>Shop</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className={`transition-transform ${
                        categoryDropdown ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                      />
                    </svg>
                  </button>

                  {categoryDropdown && (
                    <div className="bg-gray-50 border-l-2 border-blue-400 ml-4 mt-2">
                      <Link
                        href="/category"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        All Categories
                      </Link>
                      <Link
                        href="/category/eyeglasses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Eyeglasses
                      </Link>
                      <Link
                        href="/category/sunglasses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Sunglasses
                      </Link>
                      <Link
                        href="/category/lenses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Contact Lenses
                      </Link>
                      <Link
                        href="/category/accessories"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Accessories
                      </Link>
                      <Link
                        href="/category/eyeglasses?filter=kids"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        Kids Collection
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/contact"
                  className={`px-4 py-2 text-sm font-medium ${
                    isActivePath("/contact")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/faq"
                  className={`px-4 py-2 text-sm font-medium ${
                    isActivePath("/faq")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  FAQs
                </Link>
                <Link
                  href="/feedback"
                  className={`px-4 py-2 text-sm font-medium ${
                    isActivePath("/feedback")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Feedback
                </Link>

                {/* Mobile Contact Info */}
                <div className="px-4 py-3 mt-3 bg-blue-50 rounded-lg">
                  <p className="text-gray-700 font-medium text-sm">
                    Need help with your eyewear?
                  </p>
                  <div className="flex items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600 mr-2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <a
                      href="tel:+919876543210"
                      className="text-blue-600 font-bold text-sm"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                {/* Mobile Cart Button */}
                <div className="px-4 pb-2 pt-2">
                  <Link href="/cart">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2">
                      <span>View Cart</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      {cartCount > 0 && (
                        <span className="bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;
