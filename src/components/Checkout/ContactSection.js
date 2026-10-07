"use client";

import { FiUser } from "react-icons/fi";

export default function ContactSection({ formData, errors, onChange }) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-[18px] mb-4 font-semibold text-[#2c2c2c] leading-none">
        <FiUser className="text-[#1f3b57] text-[18px] shrink-0" />
        Contact information
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-600">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
            placeholder="Email"
            disabled
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">Phone</label>
          <input
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
            placeholder="Phone number"
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
          )}
        </div>
      </div>
    </div>
  );
}