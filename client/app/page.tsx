"use client";

import Link from "next/link";
import {
  FaStethoscope,
  FaRobot,
  FaVideo,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

export default function Home() {
  const colors = {
    primary: "#3b82f6", // Blue-500
    accent: "#10b981", // Emerald-500
    badge: "#6366f1", // Indigo-500
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section
        className="py-20 px-6 backdrop-blur-sm border-b border-border/50"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              AI-Powered Clinical Documentation
              <span className="block mt-2 text-[--primary]">
                Without the Burnout
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              ClinicScribe AI automates medical notes, streamlines workflows,
              and helps you focus on patient care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/demo"
                className="px-6 py-3 rounded-lg font-medium text-white shadow-md hover:opacity-90"
                style={{ backgroundColor: colors.primary }}
              >
                Request Demo
              </Link>
              <Link
                href="#how-it-works"
                className="px-6 py-3 rounded-lg font-medium border"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="rounded-xl shadow-lg border border-border/50 bg-background/50 backdrop-blur-md p-2">
              <img
                src="/dashboard.png"
                alt="ClinicScribe AI Dashboard"
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Transform Your Clinical Workflow
          </h2>
          <p className="text-lg text-muted-foreground">
            Designed by clinicians, for clinicians. Our AI handles the paperwork
            so you don&#39;t have to.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: <FaRobot className="text-blue-500 text-3xl" />,
              title: "AI Medical Scribing",
              desc: "Real-time documentation during patient encounters",
            },
            {
              icon: <FaVideo className="text-blue-500 text-3xl" />,
              title: "Telemedicine Integration",
              desc: "Seamless video visits with automated notes",
            },
            {
              icon: <FaChartLine className="text-blue-500 text-3xl" />,
              title: "EHR Synchronization",
              desc: "Works with your existing electronic health records",
            },
            {
              icon: <FaShieldAlt className="text-blue-500 text-3xl" />,
              title: "HIPAA Compliant",
              desc: "Enterprise-grade security and privacy",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-[0_0_15px_#3b82f650] transition-all"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            How ClinicScribe AI Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Start Consultation",
                desc: "Begin your patient visit via in-person or telemedicine",
              },
              {
                step: "2",
                title: "AI Listens & Learns",
                desc: "Our AI captures and structures clinical data in real-time",
              },
              {
                step: "3",
                title: "Review & Sign Off",
                desc: "Physician reviews and edits notes before EHR integration",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-8 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4"
                  style={{
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary,
                  }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join hundreds of clinicians saving 10+ hours per week with
            ClinicScribe AI.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaStethoscope className="text-blue-500" />
              <span className="text-xl font-bold">ClinicScribe AI</span>
            </div>
            <p className="text-muted-foreground">
              AI-powered clinical documentation for modern healthcare providers.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Features", "How It Works", "Pricing"],
            },
            { title: "Company", links: ["About Us", "Blog", "Careers"] },
            { title: "Legal", links: ["Privacy", "Terms", "HIPAA"] },
          ].map((col, i) => (
            <div key={i}>
              <h3 className="font-semibold mb-4">{col.title}</h3>
              <ul className="space-y-2 text-muted-foreground">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border/50 text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ClinicScribe AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
