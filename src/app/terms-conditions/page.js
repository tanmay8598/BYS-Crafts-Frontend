"use client";

import React from "react";
import { FiShield, FiShoppingBag, FiTruck, FiRefreshCcw, FiAlertCircle, FiBookOpen } from "react-icons/fi";
import { FaGavel, FaHandshake } from "react-icons/fa";

const TermsAndConditions = () => {
  const sections = [
    {
      icon: <FiShoppingBag className="text-[#E0B94B]" />,
      title: "Products",
      items: [
        "All products are handcrafted with care; slight variations in color, size, and design may occur.",
        "Product descriptions and images are for reference only; actual items may differ slightly.",
        "Each piece is unique and carries the mark of the artisan who created it.",
      ],
    },
    {
      icon: <FiShield className="text-[#E0B94B]" />,
      title: "Orders & Payments",
      items: [
        "Orders are confirmed only after full payment through our secure payment gateway.",
        "Prices are inclusive of applicable taxes as specified on product pages.",
        "We reserve the right to cancel any order due to pricing errors or stock unavailability.",
      ],
    },
    {
      icon: <FiTruck className="text-[#E0B94B]" />,
      title: "Shipping & Delivery",
      items: [
        "Delivery timelines are estimates and may vary due to external factors.",
        "Any delays caused by courier companies or unforeseen events are beyond our control.",
        "Tracking details will be shared once your order is dispatched.",
      ],
    },
    {
      icon: <FiRefreshCcw className="text-[#E0B94B]" />,
      title: "Returns & Refunds",
      items: [
        "Returns are accepted only for defective or damaged items within 7 days of delivery.",
        "Refunds (if approved) will be processed to the original payment method within 5-7 business days.",
        "Products must be unused and in original packaging for return eligibility.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-figtree py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f5efe0] mb-4">
            <FaGavel className="text-3xl text-[#1f3b57]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1f3b57] mb-3">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            By accessing or purchasing from BYS Crafts, you agree to abide by the following terms and conditions.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-md border border-[#e6dfd2] p-6 md:p-10">
          {/* Intro */}
          <div className="bg-[#faf8f5] rounded-xl border border-[#e6dfd2] p-5 mb-8">
            <div className="flex items-start gap-3">
              <FaHandshake className="text-xl text-[#1f3b57] mt-0.5" />
              <div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Welcome to <strong className="text-[#1f3b57]">BYS Crafts</strong>. 
                  Every product you see is handcrafted with passion by skilled artisans. 
                  By placing an order, you agree to our policies and guidelines.
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-[#e6dfd2] pb-6 last:border-0 last:pb-0">
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
                    <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E0B94B] mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Limitation of Liability */}
          <div className="mt-8 pt-6 border-t border-[#e6dfd2]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#f5efe0] flex items-center justify-center">
                <FiAlertCircle className="text-[#E0B94B]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1f3b57]">
                Limitation of Liability
              </h2>
            </div>
            <p className="text-gray-600 text-sm pl-11">
              BYS Crafts is not liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our liability is limited to the purchase price of the product.
            </p>
          </div>

          {/* Governing Law */}
          <div className="mt-6 pt-6 border-t border-[#e6dfd2]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#f5efe0] flex items-center justify-center">
                <FiBookOpen className="text-[#E0B94B]" />
              </div>
              <h2 className="text-xl font-semibold text-[#1f3b57]">
                Governing Law
              </h2>
            </div>
            <p className="text-gray-600 text-sm pl-11">
              These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            Last updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            For any queries, contact us at{" "}
            <a href="mailto:support@byscrafts.com" className="text-[#1f3b57] hover:text-[#E0B94B] transition">
              support@byscrafts.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;