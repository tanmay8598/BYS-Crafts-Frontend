"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NewOrderChild = ({ orderData }) => {
    const router = useRouter();
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="bg-[#FAF6ED] border border-[#1B3A5C0F] rounded-2xl mb-6 overflow-hidden">

      {/* HEADER */}
      <div className="flex justify-between items-center px-5 py-3 bg-[#e9e1d5]">
        <div className="text-[13px] text-gray-600 font-medium">
          #{orderData?._id?.slice(-12)} •{" "}
          {new Date(orderData.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>

        <span
          className={`text-[11px] px-3 py-[5px] rounded-full font-medium ${getStatusStyle(
            orderData.status
          )}`}
        >
          {orderData.status || "Processing"}
        </span>
      </div>

      {/* ITEMS */}
      <div className="divide-y divide-[#e2dbcf]">
        {orderData.orderItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center px-5 py-4"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              
              {/* IMAGE BOX (like screenshot beige box) */}
              <div className="w-[52px] h-[52px] bg-[#e6dfd2] rounded-md flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    width={48}
                    height={48}
                    alt="product"
                    className="object-cover rounded"
                  />
                ) : (
                  <span className="text-[10px] text-gray-500">
                    Product
                  </span>
                )}
              </div>

              {/* TEXT */}
              <div>
                <p className="text-[14px] font-medium text-[#2f2f2f]">
                  {item.name}
                </p>

                <p className="text-[12px] text-gray-500 mt-[2px]">
                  Qty: {item.qty}
                </p>
              </div>
            </div>

            {/* PRICE */}
            <div className="text-[14px] font-semibold text-[#2f2f2f]">
              ₹{item.price}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center px-5 py-4 border-t border-[#e2dbcf]">
        <p className="text-[14px] text-gray-600">
          Order total:{" "}
          <span className="font-semibold text-[#2f2f2f]">
            ₹{orderData.totalPrice}
          </span>
        </p>

        <div className="flex gap-3">
          <button onClick={() =>  router.push(`/account/${orderData._id}`)} className="text-[12px] px-4 py-[6px] border border-[#d8d1c5] rounded-lg text-gray-600 hover:bg-[#e9e1d5] transition">
           View Details
          </button>

        </div>
      </div>
    </div>
  );
};

export default NewOrderChild;