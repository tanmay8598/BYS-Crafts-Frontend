"use client";

export default function AddressList({ addresses, selected, onSelect }) {
  if (!addresses?.length) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {addresses.map((addr, index) => {
        const isSelected = selected?._id === addr._id;
        return (
          <div
            key={addr._id || index}
            onClick={() => onSelect(addr)}
            className={`p-4 rounded-xl border cursor-pointer transition relative ${
              isSelected
                ? "border-[#1f3b57] bg-[#e9eef5]"
                : "border-[#e6dfd2] bg-[#f8f5ef]"
            }`}
          >
            <p
              className={`text-[11px] font-semibold mb-1 tracking-widest ${
                addr.addressType?.toUpperCase() === "OFFICE"
                  ? "text-[#8b6f47]"
                  : "text-gray-600"
              }`}
            >
              {addr.addressType?.toUpperCase() || "HOME"}
            </p>
            <p className="text-sm text-[#2c2c2c] leading-snug">
              {addr.address}, {addr.street}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {addr.area}, {addr.city}, {addr.state} - {addr.pincode}
            </p>
            {isSelected && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-[#1f3b57] text-white text-xs flex items-center justify-center rounded-full">
                ✓
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}