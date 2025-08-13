"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaRobot, FaUserMd, FaChartLine, FaRegClock } from "react-icons/fa";
import Navbar from "./components/NavBar";

export default function Home() {
  const colors = {
    primary: "#2563eb", // Deeper blue (Clinico AI's brand)
    accent: "#10b981", // Emerald-500 (kept for CTAs)
  };

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scale = 1 + Math.min(scrollY * 0.0005, 0.1);

  return (
    <div>
      <div className="pb-16">
        <Navbar />
      </div>
      <div className="min-h-screen w-full bg-white relative">
        {/* Subtle grid background with softer gradients */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, rgba(229,231,235,0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,231,235,0.6) 1px, transparent 1px),
            radial-gradient(circle 600px at 10% 90%, rgba(37,99,235,0.08), transparent),
            radial-gradient(circle 600px at 90% 20%, rgba(16,185,129,0.08), transparent)
          `,
            backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
          }}
        />

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="pt-32 pb-20 px-6 min-h-[90vh]">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
              <div className="w-full max-w-2xl text-center mb-16 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">
                  The AI Clinical Assistant
                  <span className="block mt-2 text-blue-600">
                    Doctors Actually Love
                  </span>
                </h1>
                <p className="text-lg text-gray-600">
                  Clinico AI automates documentation, provides decision support,
                  and manages patient relationships—so you can focus on care,
                  not paperwork.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-lg font-medium text-white shadow-md hover:opacity-90 transition-all"
                    style={{ backgroundColor: colors.primary }}
                  >
                    See Clinico AI in Action
                  </Link>
                </div>
              </div>

              {/* Dashboard Image */}
              <div className="w-full max-w-5xl relative">
                <div
                  className="rounded-xl shadow-lg border border-gray-200 bg-white/70 backdrop-blur-md p-2 transition-transform duration-300"
                  style={{ transform: `scale(${scale})` }}
                >
                  <Image
                    src="/dashboard.png" // Replace with Clinico AI's actual dashboard
                    alt="Clinico AI assistant showing real-time documentation and insights"
                    className="rounded-lg w-full h-auto"
                    width={1000}
                    height={600}
                    priority
                  />
                  <div className="absolute -bottom-6 left-0 right-0 text-center text-gray-500 text-sm">
                    AI-generated notes with clinical decision support
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-32 px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                More Than Just a Medical Scribe
              </h2>
              <p className="text-lg text-gray-600">
                Clinico AI combines documentation automation with longitudinal
                care support.
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FaRobot className="text-blue-500 text-3xl" />,
                  title: "AI Medical Scribe",
                  desc: "Accurate, real-time documentation during consultations",
                },
                {
                  icon: <FaUserMd className="text-blue-500 text-3xl" />,
                  title: "Clinical Decision Support",
                  desc: "Evidence-based recommendations at point of care",
                },
                {
                  icon: <FaRegClock className="text-blue-500 text-3xl" />,
                  title: "Longitudinal Care",
                  desc: "Tracks patient history and outcomes over time",
                },
                {
                  icon: <FaChartLine className="text-blue-500 text-3xl" />,
                  title: "Workflow Automation",
                  desc: "Handles referrals, billing, and follow-ups automatically",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm hover:shadow-[0_0_15px_#2563eb30] transition-all"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="py-32 px-6 bg-gray-50/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-16">
                Designed for Real Clinical Workflows
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Start Consultation",
                    desc: "Clinico AI listens passively (in-person or virtual) without disrupting flow",
                  },
                  {
                    step: "2",
                    title: "AI Documents & Analyzes",
                    desc: "Generates structured notes while surfacing relevant clinical insights",
                  },
                  {
                    step: "3",
                    title: "Enhance Patient Care",
                    desc: "Focus on the patient while Clinico AI handles documentation and admin",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-8 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm hover:shadow-md transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4"
                      style={{
                        backgroundColor: colors.primary + "20",
                        color: colors.primary,
                      }}
                    >
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial/Stats Section */}
          <section className="py-32 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-8">
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ color: colors.primary }}
                  >
                    10+
                  </div>
                  <p className="text-gray-600">Hours saved per week</p>
                </div>
                <div className="text-center p-8">
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ color: colors.primary }}
                  >
                    80%
                  </div>
                  <p className="text-gray-600">
                    Reduction in documentation time
                  </p>
                </div>
                <div className="text-center p-8">
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ color: colors.primary }}
                  >
                    100%
                  </div>
                  <p className="text-gray-600">HIPAA compliant</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section
            className="py-32 px-6 text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                Reduce Burnout, Improve Care
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join the movement to put clinicians back at the center of
                healthcare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo"
                  className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Request Demo
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Talk to Sales
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-16 px-6 bg-white/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span
                    className="text-xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    Clinico AI
                  </span>
                </div>
                <p className="text-gray-600">
                  The AI clinical assistant transforming healthcare
                  documentation.
                </p>
              </div>
              {[
                {
                  title: "Product",
                  links: ["Medical Scribe", "Decision Support", "Integrations"],
                },
                {
                  title: "Resources",
                  links: ["Case Studies", "Blog", "Clinical Research"],
                },
                {
                  title: "Company",
                  links: ["About Us", "Careers", "Contact"],
                },
              ].map((col, i) => (
                <div key={i}>
                  <h3 className="font-semibold mb-4">{col.title}</h3>
                  <ul className="space-y-2 text-gray-600">
                    {col.links.map((link) => (
                      <li key={link}>
                        <Link
                          href="#"
                          className="hover:text-gray-900 transition-colors"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
              <p>
                © {new Date().getFullYear()} Clinico AI . All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
