"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import apiClient from "@/api/client";

const schema = Yup.object().shape({
  addressType: Yup.string(),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  street: Yup.string().required("Street is required"),
  mobileNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  email: Yup.string().required("Email is required").email("Enter a valid email address"),
  area: Yup.string().required("Area is required"),
  landmark: Yup.string(),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .required("PIN code is required")
    .matches(/^\d{6}$/, "PIN code must be exactly 6 digits"),
});

const EMPTY_FORM = (user) => ({
  addressType: "home",
  address: "",
  city: "",
  street: "",
  email: user?.email || "",
  mobileNumber: "",
  area: "",
  pincode: "",
  landmark: "",
  state: "",
});

export function useAddresses(user) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM(user));
  const [errors, setErrors] = useState({});

  const fetchProfile = useCallback(async () => {
    try {
      const res = await apiClient.get("/user/get-profile", { id: user?.id });
      const list = res.data.shippingAddress || [];
      setAddresses(list);
      if (list.length > 0 && !selectedAddress) setSelectedAddress(list[0]);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }, [user, selectedAddress]);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user, fetchProfile]);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }, []);

  const selectAddress = useCallback((addr) => {
    setSelectedAddress(addr);
    setFormData({
      addressType: addr.addressType || "home",
      address: addr.address || "",
      city: addr.city || "",
      street: addr.street || "",
      email: addr.email || "",
      mobileNumber: addr.mobileNumber || "",
      area: addr.area || "",
      pincode: addr.pincode || "",
      landmark: addr.landmark || "",
      state: addr.state || "",
    });
  }, []);

  const saveAddress = useCallback(async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const formatted = {};
      err.inner.forEach((e) => (formatted[e.path] = e.message));
      setErrors(formatted);
      toast.error(Object.values(formatted)[0] || "Please fix form errors");
      return false;
    }

    try {
      const res = await apiClient.post("/user/add-address", {
        userId: user.id,
        shippingAddress: formData,
      });
      if (!res.ok) {
        toast.error(res.data?.message || "Failed to save address");
        return false;
      }
      await fetchProfile();
      setFormData(EMPTY_FORM(user));
      toast.success("Address saved successfully!");
      return true;
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error(err.response?.data?.message || "Failed to save address");
      return false;
    }
  }, [formData, user, fetchProfile]);

  return {
    addresses,
    selectedAddress,
    setSelectedAddress,
    selectAddress,
    formData,
    setFormData,
    errors,
    handleInputChange,
    saveAddress,
  };
}