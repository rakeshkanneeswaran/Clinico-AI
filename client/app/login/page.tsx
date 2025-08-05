"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "./actions";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData);
      if (user) {
        router.push(`/dashboard/session?session=${user.session.sessionId}`);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-lg rounded-xl border border-white border-opacity-20 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 text-center border-b border-white border-opacity-30">
          <h1 className="text-2xl font-bold text-gray-800">MediScribe AI</h1>
          <p className="text-blue-600 mt-1 text-opacity-80">
            Welcome back, Doctor
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-white bg-opacity-70 border border-gray-200 rounded-lg py-2.5 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="doctor@clinic.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-white bg-opacity-70 border border-gray-200 rounded-lg py-2.5 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="••••••••"
                minLength={8}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-blue-500 hover:text-blue-600"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-md"
          >
            Login
          </button>

          <div className="text-center text-sm text-gray-500">
            Don not have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-blue-500 hover:text-blue-600"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
