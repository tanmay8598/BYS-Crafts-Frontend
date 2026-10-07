
"use client";

import apiClient from "@/api/client";
import useAuth from "@/auth/useAuth";
import { WHATSAPP_NUMBER } from "@/constants";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail, MdPhone, MdLocationOn, MdAccessTime } from "react-icons/md";
import { FiSend, FiMail, FiMessageCircle } from "react-icons/fi";

const emailValidation = (email) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

export default function ContactClient() {
  const { user } = useAuth()
  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const errors = {}
    const { name, email, subject, message } = formData
    if (!name?.trim()) errors.name = "Name is required"
    if (!email?.trim()) errors.email = "Email is required"
    else if (!emailValidation(email?.trim())) errors.email = "Please enter a valid email address"
    if (!subject) errors.subject = "Subject is required"
    if (!message) errors.message = "Message is required"
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const { name, email, subject, message } = formData
      const response = await apiClient.post("/support/add-support-request", {
        user: user?.id,
        name,
        email,
        subject,
        message
      })
      if (!response.ok) throw new Error("Failed to send message")
      toast.success("Message Sent Successfully")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setStatus("success");
    } catch (err) {
      setStatus("error");
      toast.error("Failed to send message")
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const contactInfo = [
    { icon: <MdLocationOn className="text-[#E0B94B]" />, label: "Location", value: "India" },
    { icon: <MdOutlineEmail className="text-[#E0B94B]" />, label: "Email", value: "support@byscrafts.com", link: "mailto:support@byscrafts.com" },
    { icon: <MdPhone className="text-[#E0B94B]" />, label: "Phone", value: "+91 98765 43210", link: "tel:+919876543210" },
    { icon: <MdAccessTime className="text-[#E0B94B]" />, label: "Support Hours", value: "Mon–Sat, 10 AM – 7 PM IST" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6ED] font-figtree py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1f3b57] mb-3">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            Have a question? We're here to help. Reach out and we'll respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Contact Info Cards - 2/5 */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#e6dfd2] p-4 flex items-center gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-full bg-[#f5efe0] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{item.label}</p>
                  {item.link ? (
                    <a href={item.link} className="text-sm font-medium text-[#1f3b57] hover:text-[#E0B94B] transition">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-[#1f3b57]">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#1f3b57] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2a4a6a] transition"
              >
                <FaWhatsapp className="w-4 h-4" />
                WhatsApp
              </a>
              <a
              target="_blank"
                href="mailto:support@byscrafts.com"
                className="flex items-center justify-center gap-2 border border-[#1f3b57] text-[#1f3b57] px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#f5efe0] transition"
              >
                <FiMail className="w-4 h-4" />
                Email Us
              </a>
            </div>

            {/* Bulk Enquiry */}
            <div className="bg-[#f5efe0] rounded-xl border border-[#e6dfd2] p-4">
              <p className="text-sm font-medium text-[#1f3b57]">Bulk Orders?</p>
              <p className="text-xs text-gray-600 mt-1">
                For bulk/corporate enquiries, select <span className="font-semibold">"Bulk"</span> in the form.
              </p>
            </div>
          </div>

          {/* Form - 3/5 */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#e6dfd2] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1f3b57] mb-1">Send a Message</h2>
            <p className="text-sm text-gray-500 mb-5">We'll get back to you within 24 hours.</p>

            {status === "success" && (
              <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                ✅ Message sent successfully!
              </div>
            )}
            {status === "error" && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                ⚠️ Something went wrong. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    className="w-full rounded-xl border border-[#e6dfd2] px-4 py-2.5 text-sm outline-none focus:border-[#1f3b57] focus:ring-1 focus:ring-[#1f3b57]/40"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    className="w-full rounded-xl border border-[#e6dfd2] px-4 py-2.5 text-sm outline-none focus:border-[#1f3b57] focus:ring-1 focus:ring-[#1f3b57]/40"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject *"
                  className="w-full rounded-xl border border-[#e6dfd2] px-4 py-2.5 text-sm outline-none focus:border-[#1f3b57] focus:ring-1 focus:ring-[#1f3b57]/40"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>

              <div>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message *"
                  className="w-full rounded-xl border border-[#e6dfd2] px-4 py-2.5 text-sm outline-none focus:border-[#1f3b57] focus:ring-1 focus:ring-[#1f3b57]/40 resize-none"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#1f3b57] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#2a4a6a] transition"
              >
                <FiSend className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {[
            { icon: "🔒", label: "Secure Payments" },
            { icon: "↩️", label: "Easy Returns" },
            { icon: "✅", label: "Authentic Products" },
            { icon: "🕰️", label: "24/7 Support" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-[#e6dfd2] p-3 text-center hover:shadow-md transition">
              <div className="text-xl">{item.icon}</div>
              <p className="text-xs font-medium text-[#1f3b57] mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}