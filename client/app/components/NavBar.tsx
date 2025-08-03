"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaStethoscope } from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  // Check auth status (replace with your actual auth check)
  useEffect(() => {
    // This would be replaced with your actual auth state check
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    // Replace with your actual logout logic
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    window.location.href = "/signup";
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      {/* Logo Section */}
      <div
        className="flex items-center space-x-2"
        onClick={() => (window.location.href = "/")}
      >
        <FaStethoscope className="text-blue-600 text-2xl" />
        <span className="text-xl font-bold text-blue-800">MediScribe AI</span>
      </div>

      {/* Navigation Links - Hidden on mobile */}
      <div className="hidden md:flex space-x-8">
        <Link
          href="#features"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Features
        </Link>
        <Link
          href="#how-it-works"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          How It Works
        </Link>
        <Link
          href="#pricing"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Pricing
        </Link>
      </div>

      {/* Authentication Buttons */}
      {isLoggedIn ? (
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-blue-600 transition-colors hidden md:block"
          >
            Dashboard
          </Link>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">DR</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link
            href="/signup"
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
