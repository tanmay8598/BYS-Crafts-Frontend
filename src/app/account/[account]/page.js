

"use client";
import apiClient from "@/api/client";
import useAuth from "@/auth/useAuth";
import OrderAddress from "@/components/OrderAddress";
import Loader from "@/components/loader/Loader";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosCart } from "react-icons/io";

const page = () => {
  const { user } = useAuth();
  const [myOrder, setMyOrder] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (user) {
      getMyOrder();
    }
  }, [user]);

  const getMyOrder = async () => {
    try {
      const response = await apiClient.get("/orders/myorders-details", {
        id: params.account,
      });

      if (response.ok) {
        setMyOrder(response.data);
      } else {
        setError(response.statusText);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const handleBackClick = () => {
    router.push("/account/");
  };

  return (
    <div className="min-h-screen bg-[#FAF6ED] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-[#1f3b57] hover:text-[#2e7d5b] transition-colors mb-6 font-medium"
        >
          {/* <IoArrowBack className="text-lg" /> */}
          <span>Back to Orders</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#e6dfd2]">
          {/* Order Header */}
          <div className="bg-[#1f3b57] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <IoIosCart className="text-white text-2xl" />
              <div>
                <h1 className="text-white text-lg font-semibold">Order Details</h1>
                <p className="text-white/60 text-sm">
                  #{myOrder?._id?.slice(-8)?.toUpperCase() || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                myOrder?.deliveryStatus === "Delivered" 
                  ? "bg-green-50 text-green-700 border-green-200" 
                  : myOrder?.deliveryStatus === "Processing"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : myOrder?.deliveryStatus === "Shipped"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}>
                {myOrder?.deliveryStatus || "Processing"}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4 border-b border-[#e6dfd2] bg-[#faf8f5]">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Items</p>
              <p className="text-lg font-bold text-[#1f3b57]">
                {myOrder?.orderItems?.reduce((sum, item) => sum + item.qty, 0) || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Amount</p>
              <p className="text-lg font-bold text-[#1f3b57]">
                ₹{myOrder?.totalPrice?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Payment</p>
              <p className={`text-sm font-semibold ${myOrder?.isPaid ? "text-green-600" : "text-amber-600"}`}>
                {myOrder?.isPaid ? "Paid" : "Pending"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Order Date</p>
              <p className="text-sm font-medium text-[#1f3b57]">
                {myOrder?.createdAt ? new Date(myOrder.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }) : "N/A"}
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Order Address Section */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Shipping Address
              </h2>
              <OrderAddress mydata={myOrder} />
            </div>

            {/* Items Section */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Order Items
              </h2>

              <div className="overflow-hidden rounded-lg border border-[#e6dfd2]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#f5f2eb]">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {myOrder?.orderItems?.length > 0 ? (
                        myOrder.orderItems.map((data, index) => (
                          <tr key={index} className="border-t border-[#e6dfd2] hover:bg-[#faf8f5] transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-[#1f3b57] line-clamp-2">
                                {data?.name}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#f5f2eb] border border-[#e6dfd2]">
                                <Image
                                  src={data?.image || "/placeholder.png"}
                                  width={56}
                                  height={56}
                                  alt={data?.name || "Product"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#f5f2eb] text-sm font-semibold text-[#1f3b57]">
                                {data?.qty}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm font-medium text-gray-700">
                                ₹{data?.price?.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                            No order items available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;