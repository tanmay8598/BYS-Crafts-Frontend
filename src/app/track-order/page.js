"use client";
import React, { useState } from "react";
import apiClient from "@/api/client";
import Tracking from "./tracking";

const Page = () => {
  const [searchBy, setSearchBy] = useState("trackingID");
  const [inputValue, setInputValue] = useState("");
  const [trackOrder, setTrackOrder] = useState(null);
  const [error, setError] = useState(null);
  const [showTracking, setShowTracking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    trackMyOrder();
  };

  const trackMyOrder = async () => {
    try {
      const response = await apiClient.get(`/delivery/track-shipment`, {
        wayBillNo: inputValue,
      });

      if (response.ok) {
        setTrackOrder(response.data.ShipmentData);
        setShowTracking(true);
        setInputValue("");
      } else {
        setError(response.statusText);
      }
    } catch (error) {
      console.log("Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };


  return (
    <>
      <div className="mx-auto lg:w-1/2">
        <div className="grid grid-cols-1 gap-3 text-center">
          <div className="p-4 m-4 font-bold">
            <h1 className="text-2xl">Track my order</h1>
          </div>
        </div>
        <div className="shadow-lg m-8 rounded-md pt-4 pb-2 px-2 shadow-blue-gray-300 bg-white">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:py-2 sm:px-3">
              <div className="text-sm flex flex-col sm:flex-row justify-between md:justify-normal md:mb-2 pb-3 md:px-3 gap-1 sm:pr-3">
                <div>Search By :</div>
                <div className="flex items-center gap-1 sm:px-3">
                  <input
                    type="radio"
                    value="trackingID"
                    checked={searchBy === "trackingID"}
                    onChange={() => setSearchBy("trackingID")}
                  />
                  <label>Tracking ID/AWB</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:py-2 sm:px-3 sm:grid-cols-6 text-center">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Enter Your Tracking ID/AWB"
                  value={inputValue}
                  checked="true"
                  onChange={(e) => setInputValue(e.target.value)}
                  className="shadow appearance-none border border-gray-300 w-full h-8 p-1 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full text-center bg-primary text-white  font-semibold mt-4 sm:mt-0 hover:bg-[#D4A01EE0] focus:outline-none focus:scale-95 h-8 transition-all"
                >
                  Track Order
                </button>
              </div>
            </div>
          </form>
          <div className="grid grid-cols-1 sm:py-2 sm:px-3">
            <p className="my-2">Check current status of your shipment.</p>
          </div>
        </div>
        {showTracking && trackOrder && <Tracking trackingData={trackOrder} />}
      </div>
    </>
  );
};

export default Page;
