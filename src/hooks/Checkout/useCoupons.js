"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/api/client";

export function useCoupons(user, cartTotal) {
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponId, setCouponId] = useState("");
  const [coupans, setCoupans] = useState([]);
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState("");

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await apiClient.get("/variation/coupon/get");
      if (res.ok) setCoupans(res.data);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const applyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setIsApplying(true);
    setCouponError("");
    try {
      const response = await apiClient.get("/variation/apply-coupon", {
        code: couponCode.trim(),
        userId: user?.id,
      });
      if (!response.ok) {
        setCouponError(response.data.message || "Invalid coupon code");
        toast.error("Invalid coupon code");
        return;
      }
      const c = response.data.promoCode;
      let amount = 0;
      if (c.type === "Percentage") {
        amount = (cartTotal * c.discount) / 100;
        if (c.maxDiscount && amount > c.maxDiscount) amount = c.maxDiscount;
      } else if (c.type === "Flat") {
        amount = c.flatDiscount;
      }
      amount = Math.min(amount, cartTotal);

      setDiscount(amount);
      setAppliedCoupon({
        code: couponCode.trim(),
        discount: amount,
        type: c.type,
        originalDiscount: c.discount,
        flatDiscount: c.flatDiscount,
        maxDiscount: c.maxDiscount,
      });
      setCouponId(c._id);
      toast.success(
        `Coupon applied! ${
          c.type === "Percentage" ? `${c.discount}% off` : `₹${c.flatDiscount} off`
        }`
      );
    } catch (err) {
      console.error("Error applying coupon:", err);
      setCouponError("Failed to apply coupon");
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplying(false);
    }
  }, [couponCode, user, cartTotal]);

  const removeCoupon = useCallback(() => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  }, []);

  return {
    couponCode,
    setCouponCode,
    discount,
    appliedCoupon,
    couponId,
    coupans,
    isApplying,
    couponError,
    setCouponError,
    applyCoupon,
    removeCoupon,
  };
}