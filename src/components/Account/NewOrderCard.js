

"use client";
import React, { useEffect, useState } from "react";
import useAuth from "@/auth/useAuth";
import apiClient from "@/api/client";
import NewOrderChild from "./NewOrderChild";
import Loader from "../loader/Loader";
import EmptyOrder from "./EmptyOrder";

const NewOrderCard = () => {
  const { user } = useAuth();
  const [myOrder, setMyOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) getMyOrder();
  }, [user]);

  const getMyOrder = async () => {
    try {
      const res = await apiClient.get("/orders/myorders1", {
        userId: user.id,
      });
      if (res.ok) setMyOrder(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      {myOrder.length === 0 ? (
        <EmptyOrder />
      ) : (
        myOrder.map((order) => (
          <NewOrderChild key={order._id} orderData={order} />
        ))
      )}
    </>
  );
};

export default NewOrderCard;