

"use client";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import InputField from "./InputField";
import apiClient from "@/api/client";
import useAuth from "@/auth/useAuth";
import SelectField from "./SelectField";

const AddressForm = ({ isOpen, setIsOpen, existingAddress, refreshAddresses  }) => {
  const { user, logIn } = useAuth();

  console.log(user)

  const isEditMode = !!existingAddress?._id;

  const [formData, setFormData] = useState({
    addressType: "home", 
    address: "",
    city: "",
    street: "",
    email: "",
    mobileNumber: "",
    area: "",
    pincode: "",
    landmark: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingAddress) {
      setFormData({
        addressType: existingAddress.addressType || "home",
        address: existingAddress.address || "",
        city: existingAddress.city || "",
        street: existingAddress.street || "",
        email: existingAddress.email || "",
        mobileNumber: existingAddress.mobileNumber || "",
        area: existingAddress.area || "",
        pincode: existingAddress.pincode || "",
        landmark: existingAddress.landmark || "",
        state: existingAddress.state || "",
      });
    } else {
      setFormData({
        addressType: "home",
        address: "",
        city: "",
        street: "",
        email: "",
        mobileNumber: "",
        area: "",
        pincode: "",
        landmark: "",
        state: "",
      });
    }
  }, [existingAddress]);

  const schema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    street: Yup.string().required("Street is required"),
    mobileNumber: Yup.string()
      .required("Phone Number is required")
      .matches(/^\d{10}$/, "Must be 10 digits"),
    email: Yup.string().required("Email is required").email("Invalid email"),
    area: Yup.string().required("Area is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .required("Pin Code is required")
      .matches(/^\d{6}$/, "Must be 6 digits"),
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, addressType: type });
  };

  const validate = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const formattedErrors = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validate();
    if (!isValid) {
      toast.error("Fix errors before submitting");
      return;
    }

    try {
      const endpoint = isEditMode
        ? "/user/update-address"
        : "/user/add-address";

      const payload = isEditMode
        ? {
            userId: user.id,
            addressId: existingAddress._id,
            shippingAddress: formData, 
          }
        : {
            userId: user.id,
            shippingAddress: formData,
          };

          console.log("endpoint, payload", endpoint, payload)

      const response = await apiClient.post(endpoint, payload);

      console.log("res", response)

      if (response.status === 200) {
        if (!isEditMode && response.data.token) {
          logIn(response.data.token);
        }

        toast.success(
          isEditMode ? "Address updated!" : "Address added!",
          { duration: 1000 }
        );

          await refreshAddresses();

        setTimeout(() => {
          setIsOpen(false);
        }, 800);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting form");
    }
  };

  const handleInputNumber = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-5">

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Address Type</p>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleTypeChange("home")}
              className={`px-4 py-2 rounded-md border text-sm ${
                formData.addressType === "home"
                  ? "bg-[#1f3b57] text-white"
                  : "border-gray-300"
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("office")}
              className={`px-4 py-2 rounded-md border text-sm ${
                formData.addressType === "office"
                  ? "bg-[#1f3b57] text-white"
                  : "border-gray-300"
              }`}
            >
              Office
            </button>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <InputField id="address" label="Address" value={formData.address} onChange={handleInputChange} error={errors.address} />
          <InputField id="street" label="Street" value={formData.street} onChange={handleInputChange} error={errors.street} />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <InputField id="city" label="City" value={formData.city} onChange={handleInputChange} error={errors.city} />
          <InputField id="mobileNumber" label="Phone Number" value={formData.mobileNumber} onChange={handleInputChange} error={errors.mobileNumber} maxLength={10} onInput={handleInputNumber} />
        </div>

        <InputField id="email" label="Email" value={formData.email} onChange={handleInputChange} error={errors.email} />
        <InputField id="landmark" label="Landmark" value={formData.landmark} onChange={handleInputChange} />

        <div className="mb-4 grid grid-cols-2 gap-2">
          <InputField id="area" label="Area" value={formData.area} onChange={handleInputChange} error={errors.area} />
          <InputField id="pincode" label="PIN Code" value={formData.pincode} onChange={handleInputChange} error={errors.pincode} maxLength={6} onInput={handleInputNumber} />
        </div>

        <SelectField id="state" label="State" value={formData.state} onChange={handleInputChange} error={errors.state}>
          <option value="">Select state</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Delhi">Delhi</option>
          <option value="Maharashtra">Maharashtra</option>
        </SelectField>

        <button className="bg-primary text-white w-full py-3 mt-4">
          {isEditMode ? "UPDATE ADDRESS" : "ADD ADDRESS"}
        </button>
      </form>

      <Toaster position="bottom-right" />
    </>
  );
};

export default AddressForm;