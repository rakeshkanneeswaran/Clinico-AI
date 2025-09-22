"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaRobot, FaUserMd, FaChartLine, FaRegClock } from "react-icons/fa";
import Navbar from "./components/NavBar";

export default function Home() {
  const colors = {
    primary: "#2563eb", // Deep Blue for trust
    accent: "#10b981", // Emerald for growth & wellness
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
        {/* Subtle background */}
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
                  AarogyNyaya{" "}
                  <span className="block mt-2 text-blue-600 text-lg font-medium">
                    (Health & Justice Together)
                  </span>
                </h1>
                <p className="text-lg text-gray-600">
                  AarogyNyaya empowers people by combining healthcare support
                  with access to justice—offering medical documentation,
                  well-being guidance, and legal assistance where needed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-lg font-medium text-white shadow-md hover:opacity-90 transition-all"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Explore AarogyNyaya
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
                    src="/dashboard.png"
                    alt="AarogyNyaya assistant showing integrated medical and legal support"
                    className="rounded-lg w-full h-auto"
                    width={1000}
                    height={600}
                    priority
                  />
                  <div className="absolute -bottom-6 left-0 right-0 text-center text-gray-500 text-sm">
                    AI-generated insights with medical + legal triage support
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-32 px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                More Than Just a Health Assistant
              </h2>
              <p className="text-lg text-gray-600">
                AarogyNyaya bridges healthcare and justice to ensure holistic
                well-being.
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FaRobot className="text-blue-500 text-3xl" />,
                  title: "AI Health Scribe",
                  desc: "Accurate, real-time medical documentation",
                },
                {
                  icon: <FaUserMd className="text-blue-500 text-3xl" />,
                  title: "Decision Support",
                  desc: "Evidence-based clinical recommendations",
                },
                {
                  icon: <FaRegClock className="text-blue-500 text-3xl" />,
                  title: "Legal Aid Insights",
                  desc: "Detects when legal help under Indian law may be needed",
                },
                {
                  icon: <FaChartLine className="text-blue-500 text-3xl" />,
                  title: "Holistic Care Tracking",
                  desc: "Monitors patient history, stress levels, and legal risks",
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
                Health and Justice, Step by Step
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Share Your Story",
                    desc: "AarogyNyaya listens carefully to your health and life concerns",
                  },
                  {
                    step: "2",
                    title: "AI Analyzes",
                    desc: "Generates structured notes, identifying medical + legal needs",
                  },
                  {
                    step: "3",
                    title: "Get Right Support",
                    desc: "We connect you to care and justice pathways",
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

          {/* Stats Section */}
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
                  <p className="text-gray-600">Languages supported</p>
                </div>
                <div className="text-center p-8">
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ color: colors.primary }}
                  >
                    80%
                  </div>
                  <p className="text-gray-600">
                    Faster access to health & legal support
                  </p>
                </div>
                <div className="text-center p-8">
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ color: colors.primary }}
                  >
                    100%
                  </div>
                  <p className="text-gray-600">Confidential & Secure</p>
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
                Together for Health & Justice
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join AarogyNyaya to ensure every voice finds care and fairness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo"
                  className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Try AarogyNyaya
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Connect With Us
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
                    AarogyNyaya
                  </span>
                  <span className="text-sm text-gray-500">
                    (Health & Justice Together)
                  </span>
                </div>
                <p className="text-gray-600">
                  The AI assistant uniting healthcare and justice for holistic
                  support.
                </p>
              </div>
              {[
                {
                  title: "Product",
                  links: [
                    "Health Scribe",
                    "Decision Support",
                    "Legal Insights",
                  ],
                },
                {
                  title: "Resources",
                  links: ["Case Studies", "Blog", "Research"],
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
                © {new Date().getFullYear()} AarogyNyaya. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
