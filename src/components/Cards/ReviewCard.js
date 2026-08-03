
"use client";
import React from "react";
import { FaUser, FaStar, FaRegStar } from "react-icons/fa";
import { IoMdCalendar } from "react-icons/io";

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ReviewCard({ review }) {
  const images = Array.isArray(review.image) ? review.image : review.image ? [review.image] : [];

  return (
    <div className="bg-[#F7F7F7] w-full rounded-xl p-5 lg:p-8 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <FaUser size={20} />
          </div>
          <div>
            <p className="font-bold text-[#4D4D4D] text-p2-mobile lg:text-[18px]">{review.name}</p>
            <p className="text-xs text-[#CE7910] font-normal">Verified Customer</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <IoMdCalendar size={14} />
          <p>{formatDate(review.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-3">
        {Array.from({ length: review.rating }, (_, i) => (
          <FaStar key={i} className="text-yellow-400" size={14} />
        ))}
        {Array.from({ length: 5 - review.rating }, (_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-gray-300" size={14} />
        ))}
      </div>

      <div className="hidden lg:block w-full h-px bg-[#4D4D4D] my-2"></div>
      <p className="text-[#4D4D4D] leading-relaxed text-xs md:text-sm mt-3">{review.comment}</p>

      {images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {images.map((imgUrl, index) => (
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
              <img src={imgUrl} alt={`Review image ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewCard;