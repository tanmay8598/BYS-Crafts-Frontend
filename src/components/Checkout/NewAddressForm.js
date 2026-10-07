"use client";

export default function NewAddressForm({
  formData,
  errors,
  onChange,
  onSave,
}) {
  const states = ["Uttar Pradesh", "Delhi"]; // extend as needed

  return (
    <>
      <div className="mb-4">
        <label className="text-xs text-gray-600 mb-2 block">Address Type</label>
        <div className="flex gap-4">
          {["home", "office"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ target: { name: "addressType", value: t } })}
              className={`px-4 py-2 rounded-md border text-sm capitalize ${
                formData.addressType === t
                  ? "bg-[#1f3b57] text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="text-xs text-gray-600">Address line 1</label>
          <input
            name="address"
            value={formData.address}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
            placeholder="House no., building name"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-gray-600">Address line 2 (optional)</label>
          <input
            name="street"
            value={formData.street}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
            placeholder="Street"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-600">Area</label>
          <input
            name="area"
            value={formData.area}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
            placeholder="Area"
          />
          {errors.area && (
            <p className="text-red-500 text-xs mt-1">{errors.area}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-600">Landmark</label>
          <input
            name="landmark"
            value={formData.landmark}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
            placeholder="Landmark"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">City</label>
          <input
            name="city"
            value={formData.city}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
            placeholder="City"
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-gray-600">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
          >
            <option value="">Select state</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-gray-600">PIN code</label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
            placeholder="6-digit PIN"
          />
          {errors.pincode && (
            <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-gray-600">Country</label>
          <select className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none">
            <option>India</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        className="mt-5 w-full md:w-[250px] bg-[#1f3b57] text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition"
      >
        Save Address
      </button>
    </>
  );
}