

import { useParams } from "next/navigation";
import React from "react";

const OrderAddress = ({ mydata }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Order Details */}
      <div className="bg-[#faf8f5] rounded-xl p-5 border border-[#e6dfd2]">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-[#e6dfd2]">
          Order Details
        </h3>
        <div className="space-y-2 text-sm">
          <p className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="font-medium text-[#1f3b57]">
              #{mydata?._id?.slice(-8)?.toUpperCase() || "N/A"}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Order Date</span>
            <span className="font-medium text-[#1f3b57]">
              {mydata ? new Date(mydata.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }) : "N/A"}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Payment Mode</span>
            <span className="font-medium text-[#1f3b57]">
              {mydata?.paymentMethod || "N/A"}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Shipping Price</span>
            <span className="font-medium text-[#1f3b57]">
              ₹{mydata?.shippingPrice?.toLocaleString() || 0}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Total Price</span>
            <span className="font-medium text-[#1f3b57]">
              ₹{mydata?.totalPrice?.toLocaleString() || 0}
            </span>
          </p>
          {mydata?.wayBill && (
            <p className="flex justify-between">
              <span className="text-gray-500">Tracking ID</span>
              <span className="font-medium text-[#1f3b57]">{mydata?.wayBill}</span>
            </p>
          )}
          <div className="mt-3 pt-3 border-t border-[#e6dfd2]">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              mydata?.deliveryStatus === "Delivered" 
                ? "bg-green-50 text-green-700 border-green-200" 
                : mydata?.deliveryStatus === "Processing"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : mydata?.deliveryStatus === "Shipped"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }`}>
              {mydata?.deliveryStatus || "Processing"}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="bg-[#faf8f5] rounded-xl p-5 border border-[#e6dfd2]">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-[#e6dfd2]">
          Shipping Address
        </h3>
        <div className="space-y-2 text-sm">
          <p className="text-[#1f3b57] font-medium">
            {mydata?.shippingAddress?.address || "N/A"}
          </p>
          <p className="text-gray-600">
            {mydata?.shippingAddress?.area && `${mydata?.shippingAddress?.area}, `}
            {mydata?.shippingAddress?.city && `${mydata?.shippingAddress?.city}, `}
            {mydata?.shippingAddress?.state && `${mydata?.shippingAddress?.state}`}
          </p>
          {mydata?.shippingAddress?.landmark && (
            <p className="text-gray-500 text-xs">
              Landmark: {mydata?.shippingAddress?.landmark}
            </p>
          )}
          {mydata?.shippingAddress?.pincode && (
            <p className="text-gray-600">
              PIN: {mydata?.shippingAddress?.pincode}
            </p>
          )}
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-[#faf8f5] rounded-xl p-5 border border-[#e6dfd2]">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-[#e6dfd2]">
          Customer Details
        </h3>
        <div className="space-y-2 text-sm">
          <p className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium text-[#1f3b57]">
              {mydata?.user?.name || "N/A"}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-[#1f3b57]">
              {mydata?.user?.email || "N/A"}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-gray-500">Phone</span>
            <span className="font-medium text-[#1f3b57]">
              {mydata?.shippingAddress?.mobileNumber || "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderAddress;