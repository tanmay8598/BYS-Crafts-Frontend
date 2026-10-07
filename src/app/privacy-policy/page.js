import React from "react";
import {
  FiShield,
  FiUser,
  FiLock,
  FiMail,
  FiShare2,
  FiDatabase,
  FiCheckCircle,
} from "react-icons/fi";
import { FaShieldAlt, FaUserShield } from "react-icons/fa";

export const metadata = {
  title: "Privacy Policy – BYS Crafts | How We Protect Your Data",
  description:
    "Read the BYS Crafts Privacy Policy. Learn how we collect, use, and safeguard your personal information when you shop handmade crafts online.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy – BYS Crafts",
    description:
      "Learn how BYS Crafts collects, uses, and safeguards your personal information.",
    url: "/privacy-policy",
    type: "website",
    siteName: "BYS Crafts",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy – BYS Crafts",
    description:
      "Learn how BYS Crafts collects, uses, and safeguards your personal information.",
  },
  robots: { index: true, follow: true },
};

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <FiDatabase className="text-[#E0B94B]" />,
      title: "Information We Collect",
      items: [
        "Personal details such as name, email, phone number, and shipping address.",
        "Payment information for completing purchases (secured through encrypted payment gateways).",
        "Browsing data such as IP address and cookies for better user experience.",
        "Order history and preferences to personalize your shopping experience.",
      ],
    },
    {
      icon: <FiUser className="text-[#E0B94B]" />,
      title: "How We Use Your Information",
      items: [
        "To process and deliver your orders accurately and on time.",
        "To improve our products, services, and website experience.",
        "To send order updates, promotional offers, and newsletters (only with your consent).",
        "To provide customer support and respond to your inquiries.",
      ],
    },
    {
      icon: <FiLock className="text-[#E0B94B]" />,
      title: "Data Security",
      items: [
        "We implement strict security measures to protect your personal data.",
        "All payment transactions are encrypted using industry-standard SSL technology.",
        "We regularly update our security protocols to safeguard against unauthorized access.",
      ],
    },
    {
      icon: <FiShare2 className="text-[#E0B94B]" />,
      title: "Sharing of Information",
      items: [
        "We do not sell or trade your personal information to third parties.",
        "Your data may be shared with trusted service providers (shipping, payment partners) to fulfill orders.",
        "We only share information that is necessary for the specific service.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-figtree py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f5efe0] mb-4">
            <FaShieldAlt className="text-3xl text-[#1f3b57]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1f3b57] mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Your privacy matters to us. Learn how we collect, use, and
            safeguard your personal information.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-md border border-[#e6dfd2] p-6 md:p-10">
          {/* Intro */}
          <div className="bg-[#faf8f5] rounded-xl border border-[#e6dfd2] p-5 mb-8">
            <div className="flex items-start gap-3">
              <FaUserShield className="text-xl text-[#1f3b57] mt-0.5" />
              <div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  At <strong className="text-[#1f3b57]">BYS Crafts</strong>, we
                  respect your privacy and are committed to protecting your
                  personal information. This policy explains how we collect,
                  use, and safeguard your data.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="border-b border-[#e6dfd2] pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#f5efe0] flex items-center justify-center">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-[#1f3b57]">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2 pl-11">
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-gray-600 text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Your Rights */}
          <div className="mt-8 pt-6 border-t border-[#e6dfd2]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#f5efe0] flex items-center justify-center">
                <FiCheckCircle className="text-[#E0B94B]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1f3b57]">
                Your Rights
              </h2>
            </div>
            <ul className="space-y-2 pl-11">
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                You can request to access, update, or delete your personal data
                at any time.
              </li>
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                You can opt out of marketing communications at any time.
              </li>
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                To exercise your rights, contact us at{" "}
                <a
                  href="mailto:support@byscrafts.com"
                  className="text-[#1f3b57] font-medium hover:text-[#E0B94B] transition"
                >
                  support@byscrafts.com
                </a>
              </li>
            </ul>
          </div>

          {/* Cookies */}
          <div className="mt-6 pt-6 border-t border-[#e6dfd2]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#f5efe0] flex items-center justify-center">
                <FiMail className="text-[#E0B94B]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1f3b57]">
                Cookies
              </h2>
            </div>
            <p className="text-gray-600 text-sm pl-11">
              We use cookies to enhance your browsing experience and analyze
              website traffic. You can control cookie preferences through your
              browser settings.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            For any privacy-related concerns, contact us at{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:support@byscrafts.com"
              className="text-[#1f3b57] hover:text-[#E0B94B] transition"
            >
              support@byscrafts.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;