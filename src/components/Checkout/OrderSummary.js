// "use client";

// import CouponBox from "./CouponBox";

// export default function OrderSummary({
//   products,
//   user,
//   backendTotals,
//   totalValue,
//   discount,
//   appliedCoupon,
//   couponCode,
//   setCouponCode,
//   couponError,
//   setCouponError,
//   isApplying,
//   onApplyCoupon,
//   onRemoveCoupon,
//   deliveryFee,
//   extraDiscount,
//   codHandlingCharge,
//   selectedPaymentMethod,
//   finalTotal,
//   onPlaceOrder,
// }) {
//   return (
//     <div className="bg-[#F7F2E7] rounded-2xl border border-[#e6e0d6] p-6 h-fit sticky top-6">
//       <h2 className="font-semibold text-[18px] mb-5 text-[#2c2c2c]">
//         Order Summary
//       </h2>

//       <div className="space-y-4">
//         {products.map((item, i) => {
//           const p = item.product || item;
//           const qty = item.quantity || 1;
//           const image = p.image?.[0] || p.images?.[0] || "";
//           const name = p.name || "Product";
//           const price = p.sell_price || p.price || 0;

//           return (
//             <div key={i} className="flex items-start gap-3">
//               <div className="w-14 h-14 rounded-md bg-[#e8e1d5] overflow-hidden flex-shrink-0">
//                 <img
//                   src={image}
//                   alt={name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-[#2c2c2c] leading-tight">
//                   {name}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-medium text-[#2c2c2c]">
//                   ₹{price.toLocaleString()}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">Qty: {qty}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="border-t border-[#e6e0d6] my-5"></div>

//       <div className="mb-5">
//         <CouponBox
//           appliedCoupon={appliedCoupon}
//           couponCode={couponCode}
//           setCouponCode={setCouponCode}
//           couponError={couponError}
//           setCouponError={setCouponError}
//           isApplying={isApplying}
//           onApply={onApplyCoupon}
//           onRemove={onRemoveCoupon}
//         />
//       </div>

//       <div className="space-y-3 text-sm">
//         <div className="flex justify-between text-gray-600">
//           <span>Total MRP</span>
//           <span>
//             ₹
//             {Math.round(
//               user ? backendTotals.totalMRP : totalValue
//             ).toLocaleString()}
//           </span>
//         </div>

//         {(user ? backendTotals.totalMRPDiscount : 0) > 0 && (
//           <div className="flex justify-between text-green-600">
//             <span>Discount on MRP</span>
//             <span>
//               -₹
//               {Math.round(
//                 user ? backendTotals.totalMRPDiscount : 0
//               ).toLocaleString()}
//             </span>
//           </div>
//         )}

//         {backendTotals.totalComboDiscount > 0 && (
//           <div className="flex justify-between items-center bg-purple-50 p-2 rounded-lg -mx-2 px-2">
//             <div className="flex flex-col">
//               <span className="text-purple-600 font-medium text-sm">
//                 Combo Savings
//               </span>
//               <span className="text-xs text-purple-400">
//                 Additional discount on combo items
//               </span>
//             </div>
//             <span className="text-purple-600 font-bold">
//               -₹{Math.round(backendTotals.totalComboDiscount).toLocaleString()}
//             </span>
//           </div>
//         )}

//         <div className="flex justify-between text-gray-600">
//           <div>
//             <span>Delivery fee</span>
//             <p
//               className={`text-xs mt-1 ${
//                 deliveryFee === 0 ? "text-green-600" : "text-gray-500"
//               }`}
//             >
//               {deliveryFee === 0
//                 ? "FREE delivery on this order!"
//                 : `₹${deliveryFee} delivery fee applies`}
//             </p>
//           </div>
//           <div className="text-right">
//             <span className="font-semibold">
//               {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
//             </span>
//           </div>
//         </div>

//         {extraDiscount > 0 && (
//           <div className="flex text-sm justify-between text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
//             <div className="flex flex-col">
//               <span className="text-green-700 font-medium">
//                 {selectedPaymentMethod === "online"
//                   ? "Prepaid Discount"
//                   : "Special Discount"}
//               </span>
//               <span className="text-xs text-green-600">
//                 {selectedPaymentMethod === "online"
//                   ? "Prepaid discount applied"
//                   : "Special discount applied"}
//               </span>
//             </div>
//             <span className="text-green-700 font-bold">-{extraDiscount}%</span>
//           </div>
//         )}

//         {codHandlingCharge > 0 && selectedPaymentMethod === "cod" && (
//           <div className="flex text-sm justify-between text-amber-600 bg-amber-50 p-2 rounded-lg -mx-2 px-2">
//             <div className="flex flex-col">
//               <span className="text-amber-700 font-medium">
//                 COD Handling Charge
//               </span>
//               <span className="text-xs text-amber-600">
//                 Extra charge for cash on delivery
//               </span>
//             </div>
//             <span className="text-amber-700 font-bold">
//               +₹{codHandlingCharge}
//             </span>
//           </div>
//         )}

//         {discount > 0 && (
//           <div className="flex text-sm justify-between text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
//             <div className="flex flex-col">
//               <span className="text-green-700 font-medium">
//                 Coupon Discount
//               </span>
//               <span className="text-xs text-green-600">
//                 {appliedCoupon?.type === "Percentage"
//                   ? `${appliedCoupon?.originalDiscount}% off`
//                   : `Flat ₹${appliedCoupon?.flatDiscount} off`}
//               </span>
//             </div>
//             <span className="text-green-700 font-bold">
//               -₹{discount.toFixed(0)}
//             </span>
//           </div>
//         )}
//       </div>

//       <div className="border-t border-[#e6e0d6] my-5"></div>

//       <div className="flex justify-between items-center mb-4">
//         <span className="text-[16px] font-semibold text-[#2c2c2c]">
//           Grand Total
//         </span>
//         <span className="text-[18px] font-semibold text-[#2c2c2c]">
//           ₹{finalTotal.toFixed(0)}
//         </span>
//       </div>

//       <button
//         onClick={onPlaceOrder}
//         className="w-full bg-[#e0bb4f] hover:bg-[#d4ad3f] py-3 rounded-lg font-semibold text-sm transition text-[#2c2c2c]"
//       >
//         Pay ₹{finalTotal.toFixed(0)}
//       </button>

//       <p className="text-xs text-gray-400 text-center mt-3">
//         🔒 Secure &amp; Encrypted
//       </p>
//     </div>
//   );
// }

"use client";

import CouponBox from "./CouponBox";

export default function OrderSummary({
  products,
  user,
  backendTotals,
  totalValue,
  discount,
  appliedCoupon,
  couponCode,
  setCouponCode,
  couponError,
  setCouponError,
  isApplying,
  onApplyCoupon,
  onRemoveCoupon,
  deliveryFee,
  extraDiscount,
  codHandlingCharge,
  selectedPaymentMethod,
  finalTotal,
  onPlaceOrder,
  children, // ← PaymentMethod goes here
}) {
  return (
    <div className="bg-[#F7F2E7] rounded-2xl border border-[#e6e0d6] p-6 h-fit sticky top-6">
      <h2 className="font-semibold text-[18px] mb-5 text-[#2c2c2c]">
        Order Summary
      </h2>

      {/* Items */}
      <div className="space-y-4">
        {products.map((item, i) => {
          const p = item.product || item;
          const qty = item.quantity || 1;
          const image = p.image?.[0] || p.images?.[0] || "";
          const name = p.name || "Product";
          const price = p.sell_price || p.price || 0;

          return (
            <div key={i} className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-md bg-[#e8e1d5] overflow-hidden flex-shrink-0">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#2c2c2c] leading-tight">
                  {name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#2c2c2c]">
                  ₹{price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">Qty: {qty}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#e6e0d6] my-5"></div>

      {/* Coupon */}
      <div className="mb-5">
        <CouponBox
          appliedCoupon={appliedCoupon}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          couponError={couponError}
          setCouponError={setCouponError}
          isApplying={isApplying}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />
      </div>

      {/* Totals */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Total MRP</span>
          <span>
            ₹
            {Math.round(
              user ? backendTotals.totalMRP : totalValue
            ).toLocaleString()}
          </span>
        </div>

        {(user ? backendTotals.totalMRPDiscount : 0) > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount on MRP</span>
            <span>
              -₹
              {Math.round(
                user ? backendTotals.totalMRPDiscount : 0
              ).toLocaleString()}
            </span>
          </div>
        )}

        {backendTotals.totalComboDiscount > 0 && (
          <div className="flex justify-between items-center bg-purple-50 p-2 rounded-lg -mx-2 px-2">
            <div className="flex flex-col">
              <span className="text-purple-600 font-medium text-sm">
                Combo Savings
              </span>
              <span className="text-xs text-purple-400">
                Additional discount on combo items
              </span>
            </div>
            <span className="text-purple-600 font-bold">
              -₹{Math.round(backendTotals.totalComboDiscount).toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <div>
            <span>Delivery fee</span>
            <p
              className={`text-xs mt-1 ${
                deliveryFee === 0 ? "text-green-600" : "text-gray-500"
              }`}
            >
              {deliveryFee === 0
                ? "FREE delivery on this order!"
                : `₹${deliveryFee} delivery fee applies`}
            </p>
          </div>
          <div className="text-right">
            <span className="font-semibold">
              {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
            </span>
          </div>
        </div>

        {extraDiscount > 0 && (
          <div className="flex text-sm justify-between text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
            <div className="flex flex-col">
              <span className="text-green-700 font-medium">
                {selectedPaymentMethod === "online"
                  ? "Prepaid Discount"
                  : "Special Discount"}
              </span>
              <span className="text-xs text-green-600">
                {selectedPaymentMethod === "online"
                  ? "Prepaid discount applied"
                  : "Special discount applied"}
              </span>
            </div>
            <span className="text-green-700 font-bold">-{extraDiscount}%</span>
          </div>
        )}

        {codHandlingCharge > 0 && selectedPaymentMethod === "cod" && (
          <div className="flex text-sm justify-between text-amber-600 bg-amber-50 p-2 rounded-lg -mx-2 px-2">
            <div className="flex flex-col">
              <span className="text-amber-700 font-medium">
                COD Handling Charge
              </span>
              <span className="text-xs text-amber-600">
                Extra charge for cash on delivery
              </span>
            </div>
            <span className="text-amber-700 font-bold">
              +₹{codHandlingCharge}
            </span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex text-sm justify-between text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
            <div className="flex flex-col">
              <span className="text-green-700 font-medium">
                Coupon Discount
              </span>
              <span className="text-xs text-green-600">
                {appliedCoupon?.type === "Percentage"
                  ? `${appliedCoupon?.originalDiscount}% off`
                  : `Flat ₹${appliedCoupon?.flatDiscount} off`}
              </span>
            </div>
            <span className="text-green-700 font-bold">
              -₹{discount.toFixed(0)}
            </span>
          </div>
        )}
      </div>

      {/* Divider + Grand Total */}
      <div className="border-t border-[#e6e0d6] my-5"></div>

      <div className="flex justify-between items-center">
        <span className="text-[16px] font-semibold text-[#2c2c2c]">
          Grand Total
        </span>
        <span className="text-[18px] font-semibold text-[#2c2c2c]">
          ₹{finalTotal.toFixed(0)}
        </span>
      </div>

      {/* Payment method goes INSIDE the card, above Pay button */}
      {children && (
        <>
          <div className="border-t border-[#e6e0d6] my-5"></div>
          {children}
        </>
      )}

      <button
        onClick={onPlaceOrder}
        className="w-full bg-[#e0bb4f] hover:bg-[#d4ad3f] py-3 rounded-lg font-semibold text-sm transition text-[#2c2c2c]"
      >
        Pay ₹{finalTotal.toFixed(0)}
      </button>

      <p className="text-xs text-gray-400 text-center mt-3">
        🔒 Secure &amp; Encrypted
      </p>
    </div>
  );
}