
"use client";
import React, { useEffect, useState } from "react";
import AddressSidebar from "../Cart/AddressSidebar";
import useAuth from "@/auth/useAuth";
import Loader from "../loader/Loader";
import apiClient from "@/api/client";
import toast, { Toaster } from "react-hot-toast";

const AddressPage = () => {
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [defaultLoadingId, setDefaultLoadingId] = useState(null);

  const { user } = useAuth();

  const getUserDetails = async () => {
    try {
      if (!user?.id) return;

      const res = await apiClient.get("/user/get-profile", {
        id: user.id,
      });

      setAddresses(res.data.shippingAddress || []);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getUserDetails();
    }
  }, [user]);

  const handleDelete = async (addressId) => {
    try {
      setDeletingId(addressId);

      const res = await apiClient.delete("/user/delete-address", {
        userId: user.id,
        addressId,
      });

      if (res.status === 200) {
        setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
        toast.success("Address deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      setDefaultLoadingId(addressId);

      const res = await apiClient.post("/user/set-default-shipping-address", {
        userId: user.id,
        addressId,
      });

      console.log("default res", res);

      if (res.status === 200) {
        toast.success("Default address updated");

        await getUserDetails();
      } else {
        toast.error("Failed to update default");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDefaultLoadingId(null);
    }
  };

  const refreshAddresses = async () => {
    await getUserDetails();
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-semibold">Saved addresses</h1>
          <p
            className="text-sm text-gray-500 mb-6"
            onClick={() => setIsOpenAccount(true)}
          >
            Manage your delivery addresses
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {addresses?.map((addr) => (
              <div
                key={addr?._id}
                className={`border rounded-xl p-5 transition ${
                  addr.isDefault
                    ? "border-black bg-[#f3efe6]"
                    : "border-[#e2ddd5] bg-[#f8f5ee]"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold tracking-wide">
                    {addr?.addressType?.toUpperCase()}
                  </span>

                  {addr?.isDefault && (
                    <span className="text-[10px] bg-yellow-400 px-2 py-[2px] rounded-full font-semibold">
                      DEFAULT
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-800 leading-5">
                  {addr?.address}, {addr?.street}
                  <br />
                  {addr?.area && `${addr?.area}, `}
                  {addr?.city}, {addr?.state} {addr?.pincode}
                </p>

                <p className="text-sm text-[#7A8A9C] mt-2">
                  +91 {addr?.mobileNumber}
                </p>

                <div className="flex gap-3 mt-4 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedAddress(addr);
                      setIsOpenAccount(true);
                    }}
                    className="px-4 py-1.5 text-sm border border-[#EDE5D3] rounded-md text-[#7A8A9C] hover:text-[#1f3b57] hover:border-[#1f3b57] transition"
                  >
                    Edit
                  </button>

                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      disabled={defaultLoadingId === addr._id}
                      className="px-4 py-1.5 text-sm border border-[#EDE5D3] rounded-md text-[#1f3b57] hover:bg-[#eee7dd] transition disabled:opacity-50"
                    >
                      {defaultLoadingId === addr._id
                        ? "Setting..."
                        : "Set as default"}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(addr._id)}
                    disabled={deletingId === addr._id}
                    className="px-4 py-1.5 text-sm border border-[#EDE5D3] rounded-md text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {deletingId === addr._id ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            ))}

            <div className="border-2 border-dashed border-[#e2ddd5] rounded-xl flex items-center justify-center h-[170px] bg-[#f8f5ee]">
              <button
                onClick={() => {
                  setSelectedAddress(null);
                  setIsOpenAccount(true);
                }}
                className="flex flex-col items-center text-gray-600"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-xl mb-2">
                  +
                </div>
                <span className="text-sm font-medium">Add new address</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddressSidebar
        isOpen={isOpenAccount}
        setIsOpen={setIsOpenAccount}
        existingAddress={selectedAddress}
        refreshAddresses={refreshAddresses}
      />

      <Toaster position="bottom-right" />
    </>
  );
};

export default AddressPage;
