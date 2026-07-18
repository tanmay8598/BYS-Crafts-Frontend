
"use client";
import useAuth from "@/auth/useAuth";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import apiClient from "@/api/client";

const MyProfile = () => {
  const { user, logIn, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresse, setAddresse] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dob: "",
  });

    // ADD THIS HELPER FUNCTION
  const formatDateForInput = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split('T')[0];
    } catch (error) {
      return "";
    }
  };

  // Add refs to prevent infinite loops
  const isFetching = useRef(false);
  const previousUserData = useRef(null);
  

  useEffect(() => {
    if (isEditing && user) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phone || user?.phoneNumber || "",
       dob: formatDateForInput(user?.dob),
      });
    }
  }, [isEditing]);

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phone || user?.phoneNumber || "",
      dob: formatDateForInput(user?.dob), 
      });
    }
  }, [user, isEditing]);

  const getUserDetails = async () => {
    // Prevent multiple simultaneous fetches
    if (isFetching.current) return;
    
    try {
      const userId = user?.id || user?._id;
      if (!userId) return;

      isFetching.current = true;

      const res = await apiClient.get("/user/get-profile", {
        id: userId,
      });

      setAddresse(res?.data);
      
      // Only update if the data has actually changed
      if (res.data) {
        const currentUserData = {
          name: user?.name,
          email: user?.email,
          phone: user?.phone || user?.phoneNumber,
          dob: user?.dob,
        };

        const newUserData = {
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || res.data.phoneNumber,
          dob: res.data.dob,
        };

        // Check if data actually changed
        const hasChanged = JSON.stringify(currentUserData) !== JSON.stringify(newUserData);
        
        if (hasChanged) {
       
          updateUser(newUserData);
        } else {
          console.log("No changes detected, skipping update");
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      isFetching.current = false;
    }
  };

  // Only fetch if user exists and we haven't fetched yet
  useEffect(() => {
    if (user && !isFetching.current) {
      // Check if we already have the data for this user
      const userId = user?.id || user?._id;
      if (userId && previousUserData.current !== userId) {
        previousUserData.current = userId;
        getUserDetails();
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const userId = user?._id || user?.id;

       const dobISO = formData.dob ? new Date(formData.dob).toISOString() : "";
      
      
      const payload = {
        id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phoneNumber,
       dob: dobISO,
      };


      const res = await apiClient.post("/user/update-user-profile", payload);
         if (res.data) {
      // Reset fetch flag
      isFetching.current = false;
      
  
      if (res.data.accessToken) {

        logIn(res.data.accessToken); 
        console.log("User updated with new token");
      }
      
      // Update form data with the new values
      if (res.data) {
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phoneNumber: res.data.phone || res.data.phoneNumber || "",
          dob: formatDateForInput(res.data.dob),
        });
      }
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(
        err?.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phoneNumber: user?.phone || user?.phoneNumber || "",
       dob: formatDateForInput(user?.dob),
      });
    }
    setIsEditing(true);
  };

  return (
    <div className="bg-[#f5f1e9] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#2c2c2c]">
              Personal information
            </h1>
            <p className="text-sm text-gray-500">
              Your account details
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 border border-[#1B3A5C] text-[#1B3A5C] rounded-md text-sm hover:bg-[#eef2f6] transition"
            >
              Edit profile
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`px-4 py-2 bg-[#1f3b57] text-white rounded-md text-sm hover:opacity-90 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update profile"}
            </button>
          )}
        </div>

        <div className="bg-[#f8f5ee] border border-[#e2ddd5] rounded-xl p-6">
          <div className="grid md:grid-cols-2 gap-y-6 gap-x-10">
            <div>
              <p className="text-xs text-gray-500 mb-1">Full name</p>
              {!isEditing ? (
                <p className="text-sm font-medium">
                  {user?.name || "Not set"}
                </p>
              ) : (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-[#e2ddd5] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#1f3b57]"
                />
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              {!isEditing ? (
                <p className="text-sm font-medium">
                  {user?.email || "Not set"}
                </p>
              ) : (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-[#e2ddd5] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#1f3b57]"
                />
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              {!isEditing ? (
                <p className="text-sm font-medium">
                  {user?.phone ? `+91 ${user.phone}` : "Not set"}
                </p>
              ) : (
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  className="w-full border border-[#e2ddd5] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#1f3b57]"
                />
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Date of birth</p>
              {!isEditing ? (
                <p className="text-sm font-medium">
 {user?.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
                </p>
              ) : (
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                  className="w-full border border-[#e2ddd5] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#1f3b57]"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;