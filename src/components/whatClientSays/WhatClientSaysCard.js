"use client";

import { Star } from "lucide-react";

const WhatClientSaysCard = ({ data }) => {
  // Handle both 'description' (from API) and 'message' (from fallback data)
  const message = data.description || data.message || "";
  const name = data.name || "";
  const location = data.location || "";
  const initials = data.initials || name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const rating = data.rating || 5; // Default to 5 if not provided

  return (
    <div className="bg-[#11263D] border border-white/10 rounded-2xl p-6 text-left h-full flex flex-col justify-between hover:shadow-lg transition">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={`${i < rating ? 'fill-[#E8C547] text-[#E8C547]' : 'fill-gray-600 text-gray-600'}`} 
          />
        ))}
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
        “{message}”
      </p>

      <div className="border-t border-white/10 mb-4"></div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#1E3A5F] flex items-center justify-center text-xs text-white font-medium">
          {initials}
        </div>

        <div>
          <p className="text-sm text-white font-medium">{name}</p>
          <p className="text-xs text-gray-400">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default WhatClientSaysCard;