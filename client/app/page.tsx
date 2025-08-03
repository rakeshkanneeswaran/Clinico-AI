// app/page.tsx
import Link from "next/link";
import {
  FaStethoscope,
  FaRobot,
  FaVideo,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Clinical Documentation
              <span className="text-blue-600 block mt-2">
                Without the Burnout
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              ClinicScribe AI automates medical notes, streamlines workflows,
              and helps you focus on patient care.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/demo"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium"
              >
                Request Demo
              </Link>
              <Link
                href="#how-it-works"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center font-medium"
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-white p-2 rounded-xl shadow-xl border border-gray-100">
              <img
                src="/hero-dashboard.png"
                alt="ClinicScribe AI Dashboard"
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Transform Your Clinical Workflow
          </h2>
          <p className="text-xl text-gray-600">
            Designed by clinicians, for clinicians. Our AI handles the paperwork
            so you don&#39;t have to.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaRobot className="text-blue-600 text-3xl" />,
              title: "AI Medical Scribing",
              desc: "Real-time documentation during patient encounters",
            },
            {
              icon: <FaVideo className="text-blue-600 text-3xl" />,
              title: "Telemedicine Integration",
              desc: "Seamless video visits with automated notes",
            },
            {
              icon: <FaChartLine className="text-blue-600 text-3xl" />,
              title: "EHR Synchronization",
              desc: "Works with your existing electronic health records",
            },
            {
              icon: <FaShieldAlt className="text-blue-600 text-3xl" />,
              title: "HIPAA Compliant",
              desc: "Enterprise-grade security and privacy",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
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
                className="bg-white p-8 rounded-xl border border-gray-200"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl mb-8 opacity-90">
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
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaStethoscope className="text-blue-400" />
              <span className="text-xl font-bold">ClinicScribe AI</span>
            </div>
            <p className="text-gray-400">
              AI-powered clinical documentation for modern healthcare providers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#features" className="hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/hipaa" className="hover:text-white">
                  HIPAA
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} ClinicScribe AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
