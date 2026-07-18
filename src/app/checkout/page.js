"use client";

import useAuth from "@/auth/useAuth";
import AddressSidebar from "@/components/Cart/AddressSidebar";
import Loader from "@/components/loader/Loader";
import OrderImagecard from "@/components/orderPage/OrderImagecard";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "@/api/client";
import useRazorpay from "react-razorpay";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { clear } from "@/redux/features/cart/cartSlice";
import { FiUser, FiMapPin, FiTruck, FiCreditCard } from "react-icons/fi";
import * as Yup from "yup";

const page = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.cart);
  const router = useRouter();
  const [Razorpay] = useRazorpay();

  const [shippingAddress, setShippingAddress] = useState(null);
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponId, setCouponId] = useState("");
  const [coupans, setCoupans] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("online");
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [formData, setFormData] = useState({
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

  // console.log("user", user)

  const schema = Yup.object().shape({
    addressType: Yup.string(),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    street: Yup.string().required("Street is required"),
    mobileNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email address"),
    area: Yup.string().required("Area is required"),
    landmark: Yup.string(),
    state: Yup.string().required("State is required"),
    pincode: Yup.string()
      .required("PIN code is required")
      .matches(/^\d{6}$/, "PIN code must be exactly 6 digits"),
  });

  const products = selector.cart;

  const totalValue = products.reduce((total, item) => {
    const price = item.product.discount
      ? item.product.sell_price -
        (item.product.discount * item.product.sell_price) / 100
      : item.product.sell_price;

    return total + item.quantity * price;
  }, 0);

  const discountedTotal = totalValue - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = async () => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return { isValid: true, errors: {} };
    } catch (err) {
      const formattedErrors = {};
      err.inner.forEach((e) => {
        formattedErrors[e.path] = e.message;
      });
      setErrors(formattedErrors);
      return { isValid: false, errors: formattedErrors };
    }
  };

  useEffect(() => {
    getCoupons();
    getUserDetails();
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (paymentStatus === true) {
      createOrderAndCheckout();
    }
  }, [paymentStatus]);

  const getCoupons = async () => {
    try {
      const res = await apiClient.get("/variation/coupon/get");
      if (res.ok) setCoupans(res.data);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    }
  };

  const handleApplyCoupons = () => {
    const coupon = coupans.find((c) => c.name === couponCode);

    if (!coupon) {
      toast.error("Invalid coupon code");
      return;
    }

    const isUsedByUser = coupon?.usedBy?.filter(
      (User) => User._id === user?.id,
    );

    if (isUsedByUser?.length > 0) {
      toast.error("Coupon already used by the user");
      return;
    }

    const discountVal = Math.min(
      (totalValue * coupon.discount) / 100,
      coupon.max,
    );

    if (discountVal >= totalValue) {
      toast.error(`Maximum discount limit for this coupon is ₹${coupon.max}`);
      return;
    }

    setDiscount(discountVal);
    setAppliedCoupon(couponCode);
    setCouponId(coupon._id);
    toast.success("Coupon applied successfully!");
  };

  const removedCoupan = () => {
    setDiscount(0);
    setAppliedCoupon("");
    setCouponCode("");
    setCouponId("");
    toast.success("Coupon removed");
  };

  const getUserDetails = async () => {
    console.log("payload", user?.id);
    try {
      const res = await apiClient.get("/user/get-profile", {
        id: user?.id,
      });

      console.log("res", res)

      setAddresses(res.data.shippingAddress || []);

      if (
        res.data.shippingAddress &&
        res.data.shippingAddress.length > 0 &&
        !selectedAddress
      ) {
        setSelectedAddress(res.data.shippingAddress[0]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSaveAddress = async () => {
    const { isValid, errors } = await validate();

    if (!isValid) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError || "Please fix form errors");
      return;
    }

    try {
      const response = await apiClient.post("/user/add-address", {
        userId: user.id,
        shippingAddress: formData,
      });

      if (response.ok) {
        if (response.data.token) {
        }

        await getUserDetails();

        setFormData({
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

        toast.success("Address saved successfully!");
      } else {
        toast.error(response.data?.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  const handleRazorpayPayment = useCallback(async () => {
    try {
      const result = await apiClient.post("/orders/payment", {
        total: discountedTotal,
        userId: user.id,
      });

      if (!result.ok) {
        throw new Error("Failed to create payment order");
      }

      const options = {
        key: result.data.notes.key,
        amount: result.data.amount,
        currency: "INR",
        name: "Bundelicrafts Pvt. Ltd",
        description: "Payment for Order",
        image: "https://example.com/your_logo",
        order_id: result.data.id,
        handler: async (res) => {
          try {
            const paymentId = res.razorpay_payment_id;
            if (paymentId) {
              setPaymentStatus(true);
            }
          } catch (error) {
            console.error("Payment handler error:", error);
            toast.error("Payment failed. Please try again.");
          }
        },
        prefill: {
          email: user?.email,
          contact: selectedAddress?.mobileNumber || user?.phone,
          name: user?.name,
        },
        theme: {
          color: "#1f3b57",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Failed to initialize payment. Please try again.");
    }
  }, [Razorpay, user, discountedTotal, shippingAddress]);

  const createOrderAndCheckout = async () => {
    try {
      const orderItems = products.map((item) => ({
        name: item.product.name,
        qty: item.quantity,
        image: item.product.image[0],
        price: item.product.sell_price,
        product: item.product._id,
        artisan: item.product.artisanInfo?.artisan?._id || null,
      }));

      console.log("Pay....", {
        orderItems,
        shippingAddress: selectedAddress || formData,
        paymentMethod:
          selectedPaymentMethod === "online"
            ? "Online Payment"
            : "Cash on Delivery",
        itemsPrice: totalValue,
        totalPrice: discountedTotal,
        deliveryStatus: "Processing",
        userId: user.id,
        isPaid: selectedPaymentMethod === "online",
      });

      const orderResult = await apiClient.post("/orders/create-order", {
        orderItems,
        shippingAddress: shippingAddress || formData,
        paymentMethod:
          selectedPaymentMethod === "online"
            ? "Online Payment"
            : "Cash on Delivery",
        itemsPrice: totalValue,
        totalPrice: discountedTotal,
        deliveryStatus: "Processing",
        userId: user.id,
        isPaid: selectedPaymentMethod === "online",
      });

      console.log("orderResult", orderResult)

      if (!orderResult.ok) {
        throw new Error("Error creating order");
      }

      if (couponId && discount > 0) {
        const couponResult = await apiClient.post("/variation/coupon/post", {
          couponId,
          userId: user.id,
        });
        if (!couponResult.ok) {
          console.error("Error applying coupon");
        }
      }

      dispatch(clear());
      toast.success("Order placed successfully!");
      router.push(`/account/${orderResult.data.orders[0]._id}`);
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    // Validate shipping address
    const addressToUse = selectedAddress || formData;
    if (!addressToUse.address || !addressToUse.city || !addressToUse.pincode) {
      toast.error("Please add a complete shipping address");
      return;
    }

    // Validate products exist
    if (!products || products.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (selectedPaymentMethod === "online") {
      // Online payment with Razorpay
      await handleRazorpayPayment();
    } else {
      // COD payment
      await createOrderAndCheckout();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="bg-[#FAF6ED] min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-center mb-10">
            {["Cart", "Shipping", "Payment", "Confirm"].map((step, i) => {
              const isCompleted = i === 0;
              const isActive = i === 1;

              return (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold
                    ${
                      isCompleted
                        ? "bg-[#2e7d5b] text-white"
                        : isActive
                          ? "bg-[#1f3b57] text-white"
                          : "bg-[#e6dfd2] text-[#9c9486]"
                    }`}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </div>

                  <span
                    className={`ml-2 hidden md:block text-sm ${
                      i <= 1 ? "text-[#2c2c2c]" : "text-[#9c9486]"
                    }`}
                  >
                    {step}
                  </span>

                  {i !== 3 && (
                    <div
                      className={`w-8 md:w-16 h-[2px] mx-4 ${
                        i === 0 ? "bg-[#2e7d5b]" : "bg-[#e6dfd2]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="flex items-center gap-2 text-[18px] mb-4 font-semibold text-[#2c2c2c] leading-none">
                  <FiUser className="text-[#1f3b57] text-[18px] shrink-0" />
                  Contact information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Email</label>
                    <input
                      name="email"
                      value={formData?.email}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                      placeholder="Email"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Phone</label>
                    <input
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                      placeholder="Phone number"
                    />
                    {errors.mobileNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-[18px] mb-4 font-semibold text-[#2c2c2c] leading-none">
                  <FiMapPin className="text-[#1f3b57] text-[18px] shrink-0" />
                  Shipping address
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((addr, index) => {
                    const isSelected = selectedAddress?._id === addr._id;

                    return (
                      <div
                        key={addr._id || index}
                        onClick={() => {
                          setSelectedAddress(addr);
                          setFormData({
                            addressType: addr.addressType || "home",
                            address: addr.address || "",
                            city: addr.city || "",
                            street: addr.street || "",
                            email: addr.email || user?.email || "",
                            mobileNumber: addr.mobileNumber || "",
                            area: addr.area || "",
                            pincode: addr.pincode || "",
                            landmark: addr.landmark || "",
                            state: addr.state || "",
                          });
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition relative
        ${
          isSelected
            ? "border-[#1f3b57] bg-[#e9eef5]"
            : "border-[#e6dfd2] bg-[#f8f5ef]"
        }`}
                      >
                        <p
                          className={`text-[11px] font-semibold mb-1 tracking-widest
        ${
          addr.addressType?.toUpperCase() === "office"
            ? "text-[#8b6f47]"
            : "text-gray-600"
        }`}
                        >
                          {addr.addressType?.toUpperCase() || "HOME"}
                        </p>

                        <p className="text-sm text-[#2c2c2c] leading-snug">
                          {addr.address}, {addr.street}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {addr.area}, {addr.city}, {addr.state} -{" "}
                          {addr.pincode}
                        </p>

                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-[#1f3b57] text-white text-xs flex items-center justify-center rounded-full">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-500 text-center mt-3">
                  or add a new address
                </p>

                <div className="mb-4">
                  <label className="text-xs text-gray-600 mb-2 block">
                    Address Type
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, addressType: "home" })
                      }
                      className={`px-4 py-2 rounded-md border text-sm ${
                        formData.addressType === "home"
                          ? "bg-[#1f3b57] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      Home
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, addressType: "office" })
                      }
                      className={`px-4 py-2 rounded-md border text-sm ${
                        formData.addressType === "office"
                          ? "bg-[#1f3b57] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      Office
                    </button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="text-xs text-gray-600">First name</label>
                    <input
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Last name</label>
                    <input
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                      placeholder="Last name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-600">
                      Address line 1
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                      placeholder="House no., building name"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-600">
                      Address line 2 (optional)
                    </label>
                    <input
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                      placeholder="Street"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-600">Area</label>
                    <input
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                      placeholder="Area"
                    />
                    {errors.area && (
                      <p className="text-red-500 text-xs mt-1">{errors.area}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-600">Landmark</label>
                    <input
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                      placeholder="Landmark"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">City</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                    >
                      <option value="">Select state</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">PIN code</label>
                    <input
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none"
                      placeholder="6-digit PIN"
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pincode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Country</label>
                    <select className="w-full mt-1 px-4 py-3 rounded-lg bg-[#efe7d7] text-sm outline-none">
                      <option>India</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAddress}
                className="mt-5 w-full md:w-[250px] bg-[#1f3b57] text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                Save Address
              </button>

              <div>
                <h2 className="flex items-center gap-2 text-[18px] mb-4 font-semibold text-[#2c2c2c] leading-none">
                  <FiTruck className="text-[#1f3b57] text-[18px] shrink-0" />
                  Shipping method
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="border border-[#d4cfc4] bg-[#eef2f7] rounded-lg p-4 flex justify-between">
                    <div>
                      <p className="text-xs font-medium">Standard delivery</p>
                      <p className="text-xs text-gray-500">5–6 business days</p>
                    </div>
                    <span className="text-green-600 text-sm">Free</span>
                  </div>

                  <div className="border border-[#d4cfc4] rounded-lg p-4 flex justify-between">
                    <span>Express delivery</span>
                    <span>₹149</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-[18px] mb-4 font-semibold text-[#2c2c2c] leading-none">
                  <FiCreditCard className="text-[#1f3b57] text-[18px] shrink-0" />
                  Payment method
                </h2>

                <div className="space-y-3 text-xs">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedPaymentMethod === "online"
                        ? "border-[#1f3b57] bg-[#eef2f7]"
                        : "border-[#d4cfc4]"
                    }`}
                    onClick={() => setSelectedPaymentMethod("online")}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={selectedPaymentMethod === "online"}
                        onChange={() => setSelectedPaymentMethod("online")}
                        className="w-4 h-4"
                      />
                      <label className="cursor-pointer">
                        UPI / Google Pay / PhonePe / Cards / Net Banking
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-7">
                      Pay securely online via Razorpay
                    </p>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedPaymentMethod === "cod"
                        ? "border-[#1f3b57] bg-[#eef2f7]"
                        : "border-[#d4cfc4]"
                    }`}
                    onClick={() => setSelectedPaymentMethod("cod")}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={selectedPaymentMethod === "cod"}
                        onChange={() => setSelectedPaymentMethod("cod")}
                        className="w-4 h-4"
                      />
                      <label className="cursor-pointer">Cash on Delivery</label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-7">
                      Pay when you receive your order
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F7F2E7] rounded-2xl border border-[#e6e0d6] p-6 h-fit sticky top-6">
              <h2 className="font-semibold text-[18px] mb-5 text-[#2c2c2c]">
                Order review
              </h2>

              <div className="space-y-4">
                {products.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-md bg-[#e8e1d5] overflow-hidden flex-shrink-0">
                      <img
                        src={item?.product?.image?.[0]}
                        alt={item?.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#2c2c2c] leading-tight">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item?.product?.category?.name || "Product"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-[#2c2c2c]">
                        ₹{item.product.sell_price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#e6e0d6] my-5"></div>

              {/* Coupon Section */}
              <div className="mb-5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#e6e0d6] text-sm outline-none focus:border-[#1f3b57]"
                  />
                  <button
                    onClick={handleApplyCoupons}
                    className="bg-[#1f3b57] text-white px-4 rounded-lg text-sm hover:opacity-90 transition"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="mt-2 flex justify-between items-center bg-green-50 p-2 rounded-lg">
                    <span className="text-xs text-green-600">
                      Coupon {appliedCoupon} applied! -₹{discount}
                    </span>
                    <button
                      onClick={removedCoupan}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalValue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[#e6e0d6] my-5"></div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-[16px] font-semibold text-[#2c2c2c]">
                  Total
                </span>
                <span className="text-[18px] font-semibold text-[#2c2c2c]">
                  ₹{discountedTotal.toLocaleString()}
                </span>
              </div>

              <div className="border border-[#e6e0d6] bg-[#efe7d7] rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 accent-[#d4ad3f]" />
                  <div>
                    <p className="text-sm font-medium text-[#2c2c2c]">
                      Gift wrapping
                    </p>
                    <p className="text-xs text-gray-500">
                      Add artisan gift wrapping + handwritten note (₹99)
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-[#e0bb4f] hover:bg-[#d4ad3f] py-3 rounded-lg font-semibold text-sm transition text-[#2c2c2c]"
              >
                {selectedPaymentMethod === "online"
                  ? `Pay ₹${discountedTotal.toLocaleString()} online →`
                  : `Place order — ₹${discountedTotal.toLocaleString()} →`}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                🔒 256-bit SSL encrypted • PCI compliant
              </p>
            </div>
          </div>

          <AddressSidebar
            isOpen={isOpenAccount}
            setIsOpen={setIsOpenAccount}
            existingAddress={shippingAddress}
            onAddressSelect={(address) => {
              setShippingAddress(address);
              setIsOpenAccount(false);
            }}
          />
        </div>
      </div>

      <Toaster position="bottom-right" />
    </>
  );
};

export default page;
