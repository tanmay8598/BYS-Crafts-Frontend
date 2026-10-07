
import React from "react";
import { FiPackage, FiXCircle, FiShield, FiRefreshCw, FiClock, FiCamera, FiCheckCircle } from "react-icons/fi";
import { FaHandshake, FaTruck } from "react-icons/fa";
export const metadata = {
  title: "Returns, Cancellations & Refunds – BYS Crafts",
  description:
    "Understand BYS Crafts' returns, cancellations, and refund policy. Learn the conditions for returns, cancellations, damaged items, and refund timelines.",
  alternates: { canonical: "/return-cancellation" },
  openGraph: {
    title: "Returns, Cancellations & Refunds – BYS Crafts",
    description:
      "Understand BYS Crafts' returns, cancellations, and refund policy for handmade products.",
    url: "/return-cancellation",
    type: "website",
    siteName: "BYS Crafts",
  },
  twitter: {
    card: "summary",
    title: "Returns, Cancellations & Refunds – BYS Crafts",
    description:
      "Understand BYS Crafts' returns, cancellations, and refund policy for handmade products.",
  },
  robots: { index: true, follow: true },
};

const ReturnCancellationPage = () => {
  const policies = [
    {
      icon: <FiShield className="text-2xl text-[#1f3b57]" />,
      title: "Quality Assurance",
      description: "Every product is crafted with care and inspected before shipping to ensure you receive the best quality.",
    },
    {
      icon: <FiXCircle className="text-2xl text-[#1f3b57]" />,
      title: "Returns & Refunds",
      description: "Return or refund is applicable only in cases of damage, defect, or wrong item received.",
    },
    {
      icon: <FiRefreshCw className="text-2xl text-[#1f3b57]" />,
      title: "Order Cancellations",
      description: "Orders can be cancelled before dispatch. Full refund for successful cancellations.",
    },
    {
      icon: <FiPackage className="text-2xl text-[#1f3b57]" />,
      title: "Damaged Items",
      description: "Report damaged or incorrect items within 48 hours for free replacement or full refund.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-figtree py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1f3b57] mb-4">
            Returns, Cancellations &{" "}
            <span className="text-[#E0B94B]">Refunds</span>
          </h1>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            We want you to love your purchase. Here's everything you need to know about our policies.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-md border border-[#e6dfd2] p-6 md:p-10 mb-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#1f3b57] mb-3">
              Our Commitment to Quality
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mx-auto">
              At BYS Crafts, every product is handcrafted with care and inspected before shipping. 
              Due to the nature of our products, we do not accept returns or exchanges once delivered, 
              except in cases of damage or defect.
            </p>
          </div>

          {/* Policy Cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {policies.map((policy, index) => (
              <div
                key={index}
                className="bg-[#faf8f5] rounded-xl border border-[#e6dfd2] p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#f5efe0] flex items-center justify-center shrink-0">
                    {policy.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1f3b57] mb-1.5">
                      {policy.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="bg-white rounded-2xl shadow-md border border-[#e6dfd2] p-6 md:p-10">
          <h2 className="text-2xl font-bold text-[#1f3b57] mb-6">
            Detailed Policy
          </h2>

          <div className="space-y-8">
            {/* Returns/Refunds */}
            <div>
              <h3 className="text-lg font-semibold text-[#1f3b57] mb-3 flex items-center gap-2">
                <FiXCircle className="text-[#E0B94B]" />
                Returns & Refunds
              </h3>
              <ul className="space-y-2 pl-6">
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Return or refund applicable only for damaged, defective, or wrong items.
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Products must be unused and in original packaging.
                </li>
              </ul>
            </div>

            {/* Order Cancellations */}
            <div>
              <h3 className="text-lg font-semibold text-[#1f3b57] mb-3 flex items-center gap-2">
                <FiRefreshCw className="text-[#E0B94B]" />
                Order Cancellations
              </h3>
              <ul className="space-y-2 pl-6">
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Orders can be cancelled before dispatch.
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Once shipped, cancellation is not possible.
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Full refund processed for successful cancellations.
                </li>
              </ul>
            </div>

            {/* Damaged Items */}
            <div>
              <h3 className="text-lg font-semibold text-[#1f3b57] mb-3 flex items-center gap-2">
                <FiPackage className="text-[#E0B94B]" />
                Damaged or Incorrect Items
              </h3>
              <ul className="space-y-2 pl-6">
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Report within <strong>48 hours</strong> of delivery.
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Share clear photos of the product and packaging.
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  After verification, we'll offer free replacement or full refund.
                </li>
              </ul>
            </div>

            {/* Refund Processing */}
            <div>
              <h3 className="text-lg font-semibold text-[#1f3b57] mb-3 flex items-center gap-2">
                <FiClock className="text-[#E0B94B]" />
                Refund Processing
              </h3>
              <ul className="space-y-2 pl-6">
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Approved refunds processed within <strong>5–7 business days</strong>.
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Refund credited to original payment method.
                </li>
              </ul>
            </div>

            {/* Important Conditions */}
            <div className="bg-[#faf8f5] rounded-xl border border-[#e6dfd2] p-5">
              <h3 className="text-lg font-semibold text-[#1f3b57] mb-3 flex items-center gap-2">
                <FiCheckCircle className="text-[#E0B94B]" />
                Important Conditions
              </h3>
              <ul className="space-y-2 pl-6">
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Requests after 48 hours of delivery will not be eligible.
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  Claims without proper photo/video evidence may be declined.
                </li>
                <li className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                  We reserve the right to decline claims due to misuse or mishandling after delivery.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Have questions? Contact us at{" "}
            <a target="_blank" href="mailto:support@byscrafts.com" className="text-[#1f3b57] font-medium hover:text-[#E0B94B] transition">
              support@byscrafts.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnCancellationPage;