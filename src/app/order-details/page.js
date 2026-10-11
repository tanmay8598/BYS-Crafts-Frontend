"use client";
import apiClient from "@/api/client";
import useAuth from "@/auth/useAuth";
import OrderAddress from "@/components/OrderAddress";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosCart } from "react-icons/io";

const page = () => {
  const { user } = useAuth();
  const [myOrder, setMyOrder] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    if (user) {
      getMyOrder();
    }
  }, [user]);

  const getMyOrder = async () => {
    try {
      const response = await apiClient.get("/orders/myorders1", {
        userId: user.id,
      });

      if (response.ok) {
        setMyOrder(response.data);
      } else {
        setError(response.statusText);
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  const handleBackClick = () => {
    router.back();
  };
  return (
    <>
      <div className="shadow-lg m-8 rounded-md   pb-2  p-6 shadow-blue-gray-300 bg-white">
        {/* order header section */}
        <div className="grid grid-cols-1  border-b-2 mb-2  ">
          <div className="flex justify-between pb-2">
            <div className="flex text-[#4F46E5] pt-2">
              <div>
                <IoIosCart className="mt-1 mr-1 " />
              </div>
              <div>My Order Details</div>
            </div>
            <div
              onClick={handleBackClick}
              className="cursor-pointer bg-primary p-2 text-white  "
            >
              Back
            </div>
          </div>
        </div>
        {/* odrder details */}
        {myOrder.map((mydata) => (
          <OrderAddress mydata={mydata} />
        ))}
        {/* order item */}
        <div className="mb-4">
          <div className="grid grid-cols-1   mb-2  ">
            <div className="border-b-2 p-3-b-2 mb-4 font-semibold text-gray-600 text-xl">
              Order Item
            </div>
          </div>
          <div>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-2 border-collapse">
                <thead>
                  <tr>
                    <th className="border p-3 border-gray-300">Item Name</th>
                    <th className="border p-3 border-gray-300">Image</th>
                    <th className="border p-3 border-gray-300">Quantity</th>
                    <th className="border p-3 border-gray-300">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-3 border-gray-300">
                      The Sliding Mr. Bones
                    </td>
                    <td className="border p-3 border-gray-300">
                      <div className="rounded">
                        <Image
                          src="https://tailwindui.com/img/ecommerce-images/confirmation-page-04-product-02.jpg"
                          width={200}
                          height={200}
                          alt="Picture of the author"
                          className="object-contain object-center w-full h-20 rounded-lg"
                        />
                      </div>
                    </td>
                    <td className="border p-3 border-gray-300">1961</td>
                    <td className="border p-3 border-gray-300">
                      Malcolm Lockyer
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
