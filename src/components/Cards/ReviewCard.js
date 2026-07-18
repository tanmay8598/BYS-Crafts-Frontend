// "use client";
// import React from "react";
// import { Star } from "lucide-react";
// import { CheckCircle } from "lucide-react";

// const ReviewCard = ({ review }) => {
//   return (
//     <div className="py-6 border-b border-[#e6decf]">

//       <div className="flex items-center justify-between">

//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-full bg-[#d8d8d8] flex items-center justify-center text-xs font-medium text-gray-700">
//             {review.name
//               .split(" ")
//               .map((w) => w[0])
//               .join("")
//               .slice(0, 2)}
//           </div>

//           <div>
//             <p className="text-sm font-medium text-gray-900">
//               {review.name}
//             </p>
//             <p className="text-xs text-gray-500">
//               {review.date}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-1 text-[#E0B94B]">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Star
//               key={i}
//               size={14}
//               fill={i < review.rating ? "#E0B94B" : "none"}
//               stroke="#E0B94B"
//             />
//           ))}
//         </div>
//       </div>

//       <p className="text-sm text-gray-700 mt-3 leading-relaxed">
//         {review.text}
//       </p>

//       <div className="flex items-center gap-2 mt-3 text-xs text-green-600">
//         <CheckCircle size={14} />
//         Verified purchase
//       </div>
//     </div>
//   );
// };

// export default ReviewCard;


"use client";
import React from "react";
import Image from "next/image";

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
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <Image src="/icons/user.png" alt="user icon" width={32} height={32} />
          </div>
          <div>
            <p className="font-bold text-[#4D4D4D] text-p2-mobile lg:text-[18px]">{review.name}</p>
            <p className="text-xs text-[#CE7910] font-normal">Verified Customer</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
      </div>

      <div className="flex items-center gap-1 mt-3">
        {Array.from({ length: review.rating }, (_, i) => (
          <Image key={i} src="/icons/rating-star.png" alt="star" width={12} height={12} />
        ))}
        {Array.from({ length: 5 - review.rating }, (_, i) => (
          <Image key={`empty-${i}`} src="/icons/rating-star-empty.png" alt="empty star" width={12} height={12} className="opacity-30" />
        ))}
      </div>

      <div className="hidden lg:block w-full h-px bg-[#4D4D4D] my-2"></div>
      <p className="text-[#4D4D4D] leading-relaxed text-xs md:text-sm mt-3">{review.comment}</p>

      {images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {images.map((imgUrl, index) => (
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
              <Image src={imgUrl} alt={`Review image ${index + 1}`} fill className="object-cover" sizes="80px" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewCard;