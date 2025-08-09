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
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    window.location.href = "/signup";
  };

  return (
    <nav className="fixed w-full  bg-black py-4 px-6 flex justify-between items-center">
      {/* Logo Section */}
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        <FaStethoscope className="text-white text-2xl" />
        <span className="text-xl font-semibold text-white tracking-tight">
          ClinicScribe AI
        </span>
      </div>

      {/* Navigation Links - Hidden on mobile */}
      <div className="hidden md:flex space-x-10">
        <Link
          href="#features"
          className="text-gray-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
        >
          Features
        </Link>
        <Link
          href="#how-it-works"
          className="text-gray-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
        >
          How It Works
        </Link>
        <Link
          href="#pricing"
          className="text-gray-300 hover:text-white transition-colors font-medium text-sm tracking-wide"
        >
          Pricing
        </Link>
      </div>

      {/* Authentication Buttons */}
      {isLoggedIn ? (
        <div className="flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="text-gray-300 hover:text-white transition-colors hidden md:block font-medium text-sm tracking-wide"
          >
            Dashboard
          </Link>
          <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
            <span className="text-sm font-medium text-white">DR</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm tracking-wide"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex space-x-5">
          <Link
            href="/signup"
            className="px-5 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm tracking-wide"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm tracking-wide"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
