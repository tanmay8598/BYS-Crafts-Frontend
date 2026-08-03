"use client";

import apiClient from "@/api/client";
import useAuth from "@/auth/useAuth";
import AddressSidebar from "@/components/Cart/AddressSidebar";
import Loader from "@/components/loader/Loader";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiCreditCard, FiMapPin, FiUser } from "react-icons/fi";
import useRazorpay from "react-razorpay";
import * as Yup from "yup";

const page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [Razorpay] = useRazorpay();

  // Use Zustand instead of Redux
  const { cart: zustandCart, clearCart } = useCartStore();

  // State for backend cart data
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [originalSubtotal, setOriginalSubtotal] = useState(0);

  const [shippingAddress, setShippingAddress] = useState(null);
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponId, setCouponId] = useState("");
  const [coupans, setCoupans] = useState([]);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("online");
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [isCodAvailable, setIsCodAvailable] = useState(false);
  const [checkingCod, setCheckingCod] = useState(false);

  const [deliveryPrices, setDeliveryPrices] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [codHandlingCharge, setCodHandlingCharge] = useState(0);

  // Backend totals state
  const [backendTotals, setBackendTotals] = useState({
    totalMRP: 0,
    totalComboDiscount: 0,
    totalMRPDiscount: 0,
    grandTotal: 0,
  });

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

  // Use backend cart items if available, otherwise fallback to Zustand cart
  const products = user ? cartItems : zustandCart;

  // Calculate total value from cart
  const totalValue = products.reduce((total, item) => {
    const product = item.product || item;
    const quantity = item.quantity || 1;
    const price = product.discount
      ? product.sell_price - (product.discount * product.sell_price) / 100
      : product.sell_price || product.price || 0;

    return total + quantity * price;
  }, 0);

  const discountedTotal = totalValue - discount;

  // Calculate final total with all discounts and fees
  const finalTotal = Math.max(
    0,
    (user ? backendTotals.grandTotal : totalValue) +
      deliveryFee +
      codHandlingCharge -
      ((user ? backendTotals.grandTotal : totalValue) * extraDiscount) / 100 -
      discount,
  );

  // Fetch delivery prices
  const getDeliveryPrices = async () => {
    try {
      const response = await apiClient.get("/delivery-fee/get", {
        paymentMethod: selectedPaymentMethod === "online" ? "PREPAID" : "COD",
      });

      if (response.ok && response.data?.data) {
        setDeliveryPrices(response.data.data);
        setExtraDiscount(response.data.data.extraDiscount || 0);
        setCodHandlingCharge(response.data.data.codHandlingCharge || 0);
      }
    } catch (error) {
      console.error("Error fetching delivery prices:", error);
    }
  };

  // Calculate delivery fee
  const calculateDeliveryFee = (cartTotal) => {
    if (!deliveryPrices) return 0;

    const { feeStrategy, feeAmount, freeThreshold } = deliveryPrices;

    if (feeStrategy === "FREE") {
      return 0;
    } else if (feeStrategy === "CONDITIONAL") {
      return cartTotal >= freeThreshold ? 0 : feeAmount;
    } else if (feeStrategy === "FIXED") {
      return feeAmount;
    }

    return 0;
  };

  // Apply linked discounts to cart - get backend pricing
  const applyLinkedDiscountsToCart = async () => {
    if (!user) return;
    try {
      const response = await apiClient.post("/cart/apply-linked-discounts", {
        userId: user?.id,
      });

      if (response.data) {
        setBackendTotals({
          totalMRP: response.data.totalMRP || 0,
          totalComboDiscount: response.data.totalComboDiscount || 0,
          totalMRPDiscount: response.data.totalMRPDiscount || 0,
          grandTotal: response.data.grandTotal || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching cart totals:", error);
    }
  };

  // Fetch backend cart data
  const fetchCartData = async () => {
    if (!user) return;

    try {
      const response = await apiClient.get("/cart/get", {
        userId: user?.id,
      });

      let items = [];
      if (response.data) {
        if (Array.isArray(response.data.cart)) items = response.data.cart;
        else if (Array.isArray(response.data.items))
          items = response.data.items;
        else if (response.data.cart) items = response.data.cart;
      }

      if (items.length === 0) {
        toast.error("Your cart is empty");
        router.push("/");
        return;
      }

      // Calculate subtotal with discounts
      const calculatedSubtotal = items.reduce((sum, item) => {
        const originalPrice = item?.product?.price || 0;
        const quantity = item?.quantity || 0;
        const discount = item?.product?.discount || 0;
        const isFlash = item?.product?.isFlash && item?.product?.flash;

        let finalPrice = originalPrice;
        if (isFlash) {
          const flash = item.product.flash;
          if (flash.discountType === "PERCENT") {
            finalPrice = finalPrice - (finalPrice * flash.discountValue) / 100;
          } else if (flash.discountType === "FIXED") {
            finalPrice = finalPrice - flash.discountValue;
          }
        } else if (discount > 0) {
          finalPrice = finalPrice - (finalPrice * discount) / 100;
        }
        finalPrice = Math.max(finalPrice, 0);
        return sum + Math.round(finalPrice) * quantity;
      }, 0);

      const originalSubtotal = items.reduce(
        (sum, item) =>
          sum + (item?.product?.price || 0) * (item?.quantity || 0),
        0,
      );

      setCartItems(items);
      setSubtotal(calculatedSubtotal);
      setOriginalSubtotal(originalSubtotal);

      // Apply linked discounts after fetching cart
      await applyLinkedDiscountsToCart();
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart information");
    }
  };

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

  // Helper function to extract weight in grams from string
  const extractWeightInGrams = (weightStr) => {
    if (!weightStr) return 0;

    const str = weightStr.toLowerCase().trim();

    try {
      if (str.includes("g") || str.includes("gram")) {
        const match = str.match(/(\d+(\.\d+)?)/);
        if (match) {
          return parseFloat(match[1]);
        }
      }

      if (str.includes("kg") || str.includes("kilogram")) {
        const match = str.match(/(\d+(\.\d+)?)/);
        if (match) {
          return parseFloat(match[1]) * 1000;
        }
      }

      if (str.includes("ml") || str.includes("l")) {
        const match = str.match(/(\d+(\.\d+)?)/);
        if (match) {
          return parseFloat(match[1]);
        }
      }

      const fallbackMatch = str.match(/(\d+(\.\d+)?)/);
      if (fallbackMatch) {
        return parseFloat(fallbackMatch[1]);
      }

      return 0;
    } catch (error) {
      console.error("Error parsing weight:", weightStr, error);
      return 0;
    }
  };

  // Calculate total weight of cart items
  const calculateTotalWeight = async (items) => {
    let totalWeight = 0;

    items.forEach((item) => {
      if (item.product && item.product.weight) {
        const weightStr = item.product.weight;
        const weight = extractWeightInGrams(weightStr);
        const quantity = item.quantity || 1;
        totalWeight += weight * quantity;
      } else if (item.weight) {
        const weightStr = item.weight;
        const weight = extractWeightInGrams(weightStr);
        const quantity = item.quantity || 1;
        totalWeight += weight * quantity;
      }
    });

    return totalWeight;
  };

  // Check if COD is available for the pincode
  const checkIfCashonDeliveryAvailable = async () => {
    if (!formData?.pincode || formData.pincode.length !== 6) {
      setIsCodAvailable(false);
      return;
    }

    setCheckingCod(true);

    setIsCodAvailable(true);

    const weightInGrams = await calculateTotalWeight(products);
    const weightInKg = weightInGrams / 1000;

    // try {
    //   const response = await apiClient.post("/shipping/check-pincode", {
    //     deliveryPincode: formData.pincode,
    //     weight: weightInKg.toString(),
    //     paymentMethod: selectedPaymentMethod === "online" ? "PREPAID" : "COD",
    //   });

    //   if (response.ok && response.data?.serviceable === true) {
    //     setIsCodAvailable(true);
    //   } else {
    //     setIsCodAvailable(false);
    //   }
    // } catch (error) {
    //   console.error("Error checking COD availability:", error);
    //   setIsCodAvailable(false);
    // } finally {
    //   setCheckingCod(false);
    // }
  };

  // Fetch delivery prices when payment method changes
  useEffect(() => {
    getDeliveryPrices();
  }, [selectedPaymentMethod]);

  // Recalculate delivery fee when cart total or delivery prices change
  useEffect(() => {
    const cartTotal = user ? backendTotals.grandTotal : totalValue;
    const fee = calculateDeliveryFee(cartTotal);
    setDeliveryFee(fee);
  }, [backendTotals.grandTotal, totalValue, deliveryPrices]);

  useEffect(() => {
    getCoupons();
    if (user) {
      getUserDetails();
      fetchCartData();
    }
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

  // Refresh cart totals when cart changes
  useEffect(() => {
    if (user && products.length > 0) {
      applyLinkedDiscountsToCart();
    }
  }, [products, user]);

  useEffect(() => {
    if (
      formData.pincode &&
      formData.pincode.length === 6 &&
      products.length > 0
    ) {
      checkIfCashonDeliveryAvailable();
    } else {
      setIsCodAvailable(false);
    }
  }, [formData.pincode, products, selectedPaymentMethod]);

  const getCoupons = async () => {
    try {
      const res = await apiClient.get("/variation/coupon/get");
      if (res.ok) setCoupans(res.data);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    }
  };

  const handleApplyCoupons = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const response = await apiClient.get("/variation/apply-coupon", {
        code: couponCode.trim(),
        userId: user?.id,
      });

      if (response.ok) {
        const couponData = response.data.promoCode;

        // Use backend totals for discount calculation
        const cartTotal = user ? backendTotals.grandTotal : totalValue;
        let discountAmount = 0;

        // Calculate discount based on coupon type
        if (couponData.type === "Percentage") {
          discountAmount = (cartTotal * couponData.discount) / 100;

          // Apply maxDiscount cap if it exists
          if (
            couponData.maxDiscount &&
            discountAmount > couponData.maxDiscount
          ) {
            discountAmount = couponData.maxDiscount;
          }
        } else if (couponData.type === "Flat") {
          discountAmount = couponData.flatDiscount;
        }

        // Ensure discount doesn't exceed cart total
        discountAmount = Math.min(discountAmount, cartTotal);

        setDiscount(discountAmount);
        setAppliedCoupon({
          code: couponCode.trim(),
          discount: discountAmount,
          type: couponData.type,
          originalDiscount: couponData.discount,
          flatDiscount: couponData.flatDiscount,
          maxDiscount: couponData.maxDiscount,
        });
        setCouponId(couponData._id);

        toast.success(
          `Coupon applied! ${
            couponData.type === "Percentage"
              ? `${couponData.discount}% off`
              : `₹${couponData.flatDiscount} off`
          }`,
        );
      } else {
        setCouponError(response.data.message || "Invalid coupon code");
        toast.error("Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon");
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removedCoupan = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  };
  const getUserDetails = async () => {
    try {
      const res = await apiClient.get("/user/get-profile", {
        id: user?.id,
      });

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
    // console.log("payment api payload", {
    //     total: finalTotal,
    //     userId: user.id,
    //   } )
    try {
      const result = await apiClient.get("/orders/payment", {
        total: finalTotal,
        userId: user.id,
      });

      // console.log("order/payment res", result)

      if (!result.ok) {
        throw new Error("Failed to create payment order");
      }

      const options = {
        key: result.data.notes.key,
        // amount: result.data.amount,
        amount: finalTotal * 100,
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
      const orderItems = products.map((item) => {
        const product = item.product || item;
        const quantity = item.quantity || 1;
        const image = product.image?.[0] || product.images?.[0] || "";
        const name = product.name || "Product";
        const price = product.sell_price || product.price || 0;

        return {
          name: name,
          qty: quantity,
          image: image,
          price: price,
          product: product._id,
          artisan: product.artisanInfo?.artisan || null,
        };
      });

      console.log("order create payload", {
        orderItems,
        shippingAddress: selectedAddress || formData,
        paymentMethod:
          selectedPaymentMethod === "online"
            ? "Online Payment"
            : "Cash on Delivery",
        itemsPrice: totalValue,
        totalPrice: finalTotal,
        deliveryStatus: "Processing",
        userId: user.id,
        isPaid: selectedPaymentMethod === "online",
      });

      const orderResult = await apiClient.post("/orders/create-order", {
        orderItems,
        shippingAddress: selectedAddress || formData,
        paymentMethod:
          selectedPaymentMethod === "online"
            ? "Online Payment"
            : "Cash on Delivery",
        itemsPrice: totalValue,
        totalPrice: finalTotal,
        deliveryStatus: "Processing",
        userId: user.id,
        isPaid: selectedPaymentMethod === "online",
      });

      console.log("res of order create", orderResult);

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

      // Clear Zustand cart
      clearCart();

      // Clear backend cart
      await apiClient.delete("/cart/clear", {
        userId: user?.id,
      });
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      toast.success("Order placed successfully!");
      router.push(`/account`);
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    const addressToUse = selectedAddress || formData;
    if (!addressToUse.address || !addressToUse.city || !addressToUse.pincode) {
      toast.error("Please add a complete shipping address");
      return;
    }

    if (!products || products.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (selectedPaymentMethod === "online") {
      await handleRazorpayPayment();
    } else {
      await createOrderAndCheckout();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="bg-[#FAF6ED] min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-4">
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
            </div>

            <div className="bg-[#F7F2E7] rounded-2xl border border-[#e6e0d6] p-6 h-fit sticky top-6">
              <h2 className="font-semibold text-[18px] mb-5 text-[#2c2c2c]">
                Order Summary
              </h2>

              <div className="space-y-4">
                {products.map((item, i) => {
                  const product = item.product || item;
                  const quantity = item.quantity || 1;
                  const image = product.image?.[0] || product.images?.[0] || "";
                  const name = product.name || "Product";
                  const price = product.sell_price || product.price || 0;
                  const category = product.category?.name || "Product";

                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-md bg-[#e8e1d5] overflow-hidden flex-shrink-0">
                        <img
                          src={image}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#2c2c2c] leading-tight">
                          {name}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-[#2c2c2c]">
                          ₹{price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Qty: {quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#e6e0d6] my-5"></div>

              {/* Coupon Section */}
              <div className="mb-5">
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-green-800">
                          {appliedCoupon.code}
                        </p>
                        <p className="text-xs text-green-600">
                          {appliedCoupon.type === "Percentage"
                            ? `${appliedCoupon.originalDiscount}% off`
                            : `Flat ₹${appliedCoupon.flatDiscount} off`}
                          {appliedCoupon.maxDiscount &&
                            appliedCoupon.type === "Percentage" &&
                            ` (Max ₹${appliedCoupon.maxDiscount})`}
                        </p>
                      </div>
                      <button
                        onClick={removedCoupan}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError("");
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#e6e0d6] text-sm outline-none focus:border-[#1f3b57]"
                      />
                      <button
                        onClick={handleApplyCoupons}
                        disabled={isApplyingCoupon}
                        className="bg-[#1f3b57] text-white px-4 rounded-lg text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApplyingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-xs">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total MRP</span>
                  <span>
                    ₹
                    {Math.round(
                      user ? backendTotals.totalMRP : totalValue,
                    ).toLocaleString()}
                  </span>
                </div>

                {(user ? backendTotals.totalMRPDiscount : 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount on MRP</span>
                    <span>
                      -₹
                      {Math.round(
                        user ? backendTotals.totalMRPDiscount : 0,
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

                {backendTotals.totalComboDiscount > 0 && (
                  <div className="flex justify-between items-center bg-purple-50 p-2 rounded-lg -mx-2 px-2">
                    <div className="flex flex-col">
                      <span className="text-purple-600 font-medium text-sm">
                         Combo Savings
                      </span>
                      <span className="text-xs text-purple-400">
                        Additional discount on combo items
                      </span>
                    </div>
                    <span className="text-purple-600 font-bold">
                      -₹
                      {Math.round(
                        backendTotals.totalComboDiscount,
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <div>
                    <span>Delivery fee</span>

                    <p
                      className={`text-xs mt-1 ${deliveryFee === 0 ? "text-green-600" : "text-gray-500"}`}
                    >
                      {deliveryFee === 0
                        ? "FREE delivery on this order!"
                        : `₹${deliveryFee} delivery fee applies`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                </div>

                {extraDiscount > 0 && (
                  <div className="flex text-sm justify-between text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
                    <div className="flex flex-col">
                      <span className="text-green-700 font-medium">
                        {selectedPaymentMethod === "online"
                          ? "Prepaid Discount"
                          : "Special Discount"}
                      </span>
                      <span className="text-xs text-green-600">
                        {selectedPaymentMethod === "online"
                          ? "Prepaid discount applied"
                          : "Special discount applied"}
                      </span>
                    </div>
                    <span className="text-green-700 font-bold">
                      -{extraDiscount}%
                    </span>
                  </div>
                )}

                {codHandlingCharge > 0 && selectedPaymentMethod === "cod" && (
                  <div className="flex text-sm justify-between text-amber-600 bg-amber-50 p-2 rounded-lg -mx-2 px-2">
                    <div className="flex flex-col">
                      <span className="text-amber-700 font-medium">
                        COD Handling Charge
                      </span>
                      <span className="text-xs text-amber-600">
                        Extra charge for cash on delivery
                      </span>
                    </div>
                    <span className="text-amber-700 font-bold">
                      +₹{codHandlingCharge}
                    </span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex text-sm justify-between text-green-600 bg-green-50 p-2 rounded-lg -mx-2 px-2">
                    <div className="flex flex-col">
                      <span className="text-green-700 font-medium">
                        Coupon Discount
                      </span>
                      <span className="text-xs text-green-600">
                        {appliedCoupon?.type === "Percentage"
                          ? `${appliedCoupon?.originalDiscount}% off`
                          : `Flat ₹${appliedCoupon?.flatDiscount} off`}
                      </span>
                    </div>
                    <span className="text-green-700 font-bold">
                      -₹{discount.toFixed(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-[#e6e0d6] my-5"></div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-[16px] font-semibold text-[#2c2c2c]">
                  Grand Total
                </span>
                <span className="text-[18px] font-semibold text-[#2c2c2c]">
                  ₹{finalTotal.toFixed(0)}
                </span>
              </div>

              <div className="my-4">
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
                        UPI | Credit/Debit | Netbanking | Wallet
                      </label>
                    </div>
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
                  </div>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-[#e0bb4f] hover:bg-[#d4ad3f] py-3 rounded-lg font-semibold text-sm transition text-[#2c2c2c]"
              >
                Pay ₹{finalTotal.toFixed(0)}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                🔒 Secure & Encrypted
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
