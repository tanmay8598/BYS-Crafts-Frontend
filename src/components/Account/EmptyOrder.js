import React from "react";
import AddtoCartBtn from "../Button/AddtoCartBtn";
import { useRouter } from "next/navigation";

const EmptyOrder = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/new-arrivals");
  };
  return (
    <>
      <div className="text-center">
        <div className="my-5">
          <span className=" text-2xl font-medium">Orders</span>
          <span
            className="  absolute bg-black  text-white p-1"
            style={{
              fontSize: "10px",

              borderRadius: "30px",
              height: "22px",
              width: "22px",
              textAlign: "center",
            }}
          >
           0
          </span>
        </div>
        <div className="my-5 text-gray-500">
          You have not placed any orders yet.
        </div>
        <div className="my-5 ">
          <button
            onClick={handleClick}
            className="bg-primary py-3 px-7 rounded-lg text-white"
          >
            START SHOPPING
          </button>
        </div>
      </div>
    </>
  );
};

export default EmptyOrder;
