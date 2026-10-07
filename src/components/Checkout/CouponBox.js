"use client";

export default function CouponBox({
  appliedCoupon,
  couponCode,
  setCouponCode,
  setCouponError,
  couponError,
  isApplying,
  onApply,
  onRemove,
}) {
  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-green-800">
              {appliedCoupon.code}
            </p>
            <p className="text-xs text-green-600">
              {appliedCoupon.type === "Percentage"
                ? `${appliedCoupon.originalDiscount}% off`
                : `Flat ₹${appliedCoupon.flatDiscount} off`}
              {appliedCoupon.maxDiscount &&
                appliedCoupon.type === "Percentage" &&
                ` (Max ₹${appliedCoupon.maxDiscount})`}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 text-xs font-semibold"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
            setCouponError("");
          }}
          className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#e6e0d6] text-sm outline-none focus:border-[#1f3b57]"
        />
        <button
          onClick={onApply}
          disabled={isApplying}
          className="bg-[#1f3b57] text-white px-4 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApplying ? "Applying..." : "Apply"}
        </button>
      </div>
      {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
    </div>
  );
}