

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FiMapPin } from "react-icons/fi";
import useRazorpay from "react-razorpay";
import { useCartStore } from "@/stores/cartStore";
import useAuth from "@/auth/useAuth";
import apiClient from "@/api/client";
import Loader from "@/components/loader/Loader";
import AddressSidebar from "@/components/Cart/AddressSidebar";

import ContactSection from "@/components/Checkout/ContactSection";
import AddressList from "@/components/Checkout/AddressList";
import NewAddressForm from "@/components/Checkout/NewAddressForm";
import PaymentMethod from "@/components/Checkout/PaymentMethod";
import OrderSummary from "@/components/Checkout/OrderSummary";

import { useCheckoutCart } from './../../hooks/Checkout/useCheckoutCart';
import { useAddresses } from './../../hooks/Checkout/useAddresses';
import { useCoupons } from './../../hooks/Checkout/useCoupons';
import { useDeliveryPayment } from './../../hooks/Checkout/useDeliveryPayment';

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [Razorpay] = useRazorpay();
  const { clearCart } = useCartStore();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("online");
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { products, totalValue, backendTotals } = useCheckoutCart(user);

  const cartTotal = user ? backendTotals.grandTotal : totalValue;

  const {
    couponCode,
    setCouponCode,
    discount,
    appliedCoupon,
    couponId,
    isApplying,
    couponError,
    setCouponError,
    applyCoupon,
    removeCoupon,
  } = useCoupons(user, cartTotal);

  const {
    addresses,
    selectedAddress,
    selectAddress,
    formData,
    setFormData,
    errors,
    handleInputChange,
    saveAddress,
  } = useAddresses(user);

  const { deliveryFee, extraDiscount, codHandlingCharge } = useDeliveryPayment(
    selectedPaymentMethod,
    cartTotal
  );

  const finalTotal = useMemo(
    () =>
      Math.max(
        0,
        cartTotal +
          deliveryFee +
          codHandlingCharge -
          (cartTotal * extraDiscount) / 100 -
          discount
      ),
    [cartTotal, deliveryFee, codHandlingCharge, extraDiscount, discount]
  );

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const createOrderAndCheckout = useCallback(async () => {
    try {
      const orderItems = products.map((item) => {
        const p = item.product || item;
        return {
          name: p.name || "Product",
          qty: item.quantity || 1,
          image: p.image?.[0] || p.images?.[0] || "",
          price: p.sell_price || p.price || 0,
          product: p._id,
          artisan: p.artisanInfo?.artisan || null,
        };
      });

      const payload = {
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
      };

      const orderResult = await apiClient.post("/orders/create-order", payload);
      if (!orderResult.ok) throw new Error("Error creating order");

      if (couponId && discount > 0) {
        await apiClient.post("/variation/coupon/post", {
          couponId,
          userId: user.id,
        });
      }

      clearCart();
      await apiClient.delete("/cart/clear", { userId: user?.id });
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      toast.success("Order placed successfully!");
      router.push("/account");
    } catch (err) {
      console.error("Order creation failed:", err);
      toast.error("Failed to place order. Please try again.");
    }
  }, [
    products,
    selectedAddress,
    formData,
    selectedPaymentMethod,
    totalValue,
    finalTotal,
    user,
    couponId,
    discount,
    clearCart,
    router,
  ]);

  const handleRazorpayPayment = useCallback(async () => {

    // console.log("hit")
    // console.log("hit", {
    //     total: finalTotal,
    //     userId: user.id,
    //   })
    try {
      const result = await apiClient.get("/orders/payment", {
        total: finalTotal,
        userId: user.id,
      });

      // console.log("res", result)
      if (!result.ok) throw new Error("Failed to create payment order");

      const options = {
        key: result.data.notes.key,
        amount: finalTotal * 100,
        currency: "INR",
        name: "Bundelicrafts Pvt. Ltd",
        description: "Payment for Order",
        order_id: result.data.id,
        handler: (res) => {
          if (res.razorpay_payment_id) setPaymentStatus(true);
        },
        prefill: {
          email: user?.email,
          contact: selectedAddress?.mobileNumber || user?.phone,
          name: user?.name,
        },
        theme: { color: "#1f3b57" },
        modal: { ondismiss: () => toast.error("Payment cancelled") },
      };
      new Razorpay(options).open();
    } catch (err) {
      console.error("Razorpay error:", err);
      toast.error("Failed to initialize payment.");
    }
  }, [Razorpay, user, finalTotal, selectedAddress]);

  useEffect(() => {
    if (paymentStatus) createOrderAndCheckout();
  }, [paymentStatus, createOrderAndCheckout]);

  const handlePlaceOrder = useCallback(async () => {
    const addr = selectedAddress || formData;
    if (!addr.address || !addr.city || !addr.pincode) {
      toast.error("Please add a complete shipping address");
      return;
    }
    if (!products?.length) {
      toast.error("Your cart is empty");
      return;
    }
    if (selectedPaymentMethod === "online") await handleRazorpayPayment();
    else await createOrderAndCheckout();
  }, [
    selectedAddress,
    formData,
    products,
    selectedPaymentMethod,
    handleRazorpayPayment,
    createOrderAndCheckout,
  ]);

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="bg-[#FAF6ED] min-h-screen py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ContactSection
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
              />

              <div>
                <h2 className="flex items-center gap-2 text-[18px] mb-4 font-semibold text-[#2c2c2c] leading-none">
                  <FiMapPin className="text-[#1f3b57] text-[18px] shrink-0" />
                  Shipping address
                </h2>

                <AddressList
                  addresses={addresses}
                  selected={selectedAddress}
                  onSelect={selectAddress}
                />

                {addresses.length > 0 && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    or add a new address
                  </p>
                )}

                <NewAddressForm
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onSave={saveAddress}
                />
              </div>
            </div>

            <div>
              {/* PaymentMethod is now a CHILD of OrderSummary */}
              <OrderSummary
                products={products}
                user={user}
                backendTotals={backendTotals}
                totalValue={totalValue}
                discount={discount}
                appliedCoupon={appliedCoupon}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                couponError={couponError}
                setCouponError={setCouponError}
                isApplying={isApplying}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
                deliveryFee={deliveryFee}
                extraDiscount={extraDiscount}
                codHandlingCharge={codHandlingCharge}
                selectedPaymentMethod={selectedPaymentMethod}
                finalTotal={finalTotal}
                onPlaceOrder={handlePlaceOrder}
              >
                <PaymentMethod
                  value={selectedPaymentMethod}
                  onChange={setSelectedPaymentMethod}
                />
              </OrderSummary>
            </div>
          </div>

          <AddressSidebar
            isOpen={isOpenAccount}
            setIsOpen={setIsOpenAccount}
            existingAddress={selectedAddress}
            onAddressSelect={(a) => {
              selectAddress(a);
              setIsOpenAccount(false);
            }}
          />
        </div>
      </div>
      <Toaster position="bottom-right" />
    </>
  );
}