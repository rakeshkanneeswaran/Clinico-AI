"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaStethoscope,
  FaRobot,
  FaUserMd,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

export default function Home() {
  const colors = {
    primary: "#3b82f6", // Blue-500
    accent: "#10b981", // Emerald-500
  };

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate scale based on scroll position
  const scale = 1 + Math.min(scrollY * 0.0005, 0.1); // Max 10% scale up

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Dual Gradient Overlay Background */}

      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
            radial-gradient(circle 500px at 20% 100%, rgba(139,92,246,0.3), transparent),
            radial-gradient(circle 500px at 100% 80%, rgba(59,130,246,0.3), transparent)
          `,
          backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
        }}
      />

      <div className="relative z-10">
        {/* Hero Section - Stacked Layout */}
        <section className="pt-32 pb-20 px-6 min-h-[90vh]">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            {/* Text Content Above Image */}
            <div className="w-full max-w-2xl text-center mb-16 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                AI-Powered Clinical Documentation
                <span className="block mt-2 text-blue-600">
                  Without the Burnout
                </span>
              </h1>
              <p className="text-lg text-gray-600">
                ClinicScribe AI instantly generates accurate medical notes from
                patient conversations, saving doctors hours of documentation
                time after every appointment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo"
                  className="px-6 py-3 rounded-lg font-medium text-white shadow-md hover:opacity-90"
                  style={{ backgroundColor: colors.primary }}
                >
                  Request Demo
                </Link>
                <Link
                  href="#how-it-works"
                  className="px-6 py-3 rounded-lg font-medium border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors"
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* Dashboard Image Below Text */}
            <div className="w-full max-w-4xl relative">
              <div
                className="rounded-xl shadow-lg border border-gray-200 bg-white/50 backdrop-blur-md p-2 transition-transform duration-300"
                style={{ transform: `scale(${scale})` }}
              >
                <Image
                  src="/dashboard.png"
                  alt="ClinicScribe AI Dashboard showing real-time note generation"
                  className="rounded-lg w-full h-auto"
                  width={800}
                  height={500}
                  priority
                />
                <div className="absolute -bottom-6 left-0 right-0 text-center text-gray-500 text-sm">
                  Watch as ClinicScribe converts patient conversations into
                  structured clinical notes in seconds
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Revolutionize Your Documentation Workflow
            </h2>
            <p className="text-lg text-gray-600">
              Designed by physicians to reduce administrative burden and prevent
              clinician burnout.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <FaRobot className="text-blue-500 text-3xl" />,
                title: "Real-Time Note Generation",
                desc: "AI listens to patient encounters and creates draft notes instantly",
              },
              {
                icon: <FaUserMd className="text-blue-500 text-3xl" />,
                title: "Physician-First Design",
                desc: "Adapts to your specialty and documentation style",
              },
              {
                icon: <FaChartLine className="text-blue-500 text-3xl" />,
                title: "EHR Integration",
                desc: "Seamlessly pushes notes to your existing EHR system",
              },
              {
                icon: <FaShieldAlt className="text-blue-500 text-3xl" />,
                title: "HIPAA Compliant",
                desc: "Enterprise-grade security protecting patient data",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:shadow-[0_0_15px_#3b82f650] transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 px-6 bg-gray-50/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">
              How ClinicScribe Works in Your Practice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Conduct Patient Visit",
                  desc: "Have a natural conversation while ClinicScribe listens (in-person or virtual)",
                },
                {
                  step: "2",
                  title: "AI Documentation",
                  desc: "Our AI generates complete SOAP notes before you finish the appointment",
                },
                {
                  step: "3",
                  title: "Review & Sign",
                  desc: "Quickly verify and sign off on notes that automatically sync to your EHR",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-8 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4 bg-blue-100 text-blue-600">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 text-white bg-gradient-to-r from-blue-500 to-emerald-500">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Reclaim 10+ Hours Per Week
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join physicians who are reducing documentation time by 80% while
              improving note quality.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Your Free Trial
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaStethoscope className="text-blue-500" />
                <span className="text-xl font-bold">ClinicScribe AI</span>
              </div>
              <p className="text-gray-600">
                The physician's AI assistant for effortless clinical
                documentation.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Specialties", "Integrations"],
              },
              {
                title: "Resources",
                links: ["Case Studies", "Blog", "Webinars"],
              },
              { title: "Company", links: ["About Us", "Contact", "Careers"] },
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
              © {new Date().getFullYear()} ClinicScribe AI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
