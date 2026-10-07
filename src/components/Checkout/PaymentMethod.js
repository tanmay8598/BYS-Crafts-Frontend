// "use client";

// import { FiCreditCard } from "react-icons/fi";

// export default function PaymentMethod({ value, onChange }) {
//   const options = [
//     { id: "online", label: "UPI | Credit/Debit | Netbanking | Wallet" },
//     { id: "cod", label: "Cash on Delivery" },
//   ];

//   return (
//     <div className="my-4">
//       <h2 className="flex items-center gap-2 text-[18px] mb-4 font-semibold text-[#2c2c2c] leading-none">
//         <FiCreditCard className="text-[#1f3b57] text-[18px] shrink-0" />
//         Payment method
//       </h2>
//       <div className="space-y-3 text-xs">
//         {options.map((opt) => (
//           <div
//             key={opt.id}
//             onClick={() => onChange(opt.id)}
//             className={`border rounded-lg p-4 cursor-pointer transition ${
//               value === opt.id
//                 ? "border-[#1f3b57] bg-[#eef2f7]"
//                 : "border-[#d4cfc4]"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <input
//                 type="radio"
//                 checked={value === opt.id}
//                 onChange={() => onChange(opt.id)}
//                 className="w-4 h-4"
//               />
//               <label className="cursor-pointer">{opt.label}</label>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { FiCreditCard } from "react-icons/fi";

export default function PaymentMethod({ value, onChange }) {
  const options = [
    { id: "online", label: "UPI | Credit/Debit | Netbanking | Wallet" },
    { id: "cod", label: "Cash on Delivery" },
  ];

  return (
    <div className="mt-5 mb-5">
      <h2 className="flex items-center gap-2 text-[18px] mb-4 font-semibold text-[#2c2c2c] leading-none">
        <FiCreditCard className="text-[#1f3b57] text-[18px] shrink-0" />
        Payment method
      </h2>

      <div className="space-y-3 text-xs">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`border rounded-lg p-4 cursor-pointer transition ${
              value === opt.id
                ? "border-[#1f3b57] bg-[#eef2f7]"
                : "border-[#d4cfc4]"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={value === opt.id}
                onChange={() => onChange(opt.id)}
                className="w-4 h-4"
              />
              <label className="cursor-pointer">{opt.label}</label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}