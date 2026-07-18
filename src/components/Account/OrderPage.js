import React from "react";
import NewOrderCard from "./NewOrderCard";

const OrderPage = () => {
  return (
    <div className=" ">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">Recent orders</h2>
      </div>

      <NewOrderCard />
    </div>
  );
};

export default OrderPage;