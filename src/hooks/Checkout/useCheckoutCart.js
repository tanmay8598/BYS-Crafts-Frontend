"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import apiClient from "@/api/client";
import { useCartStore } from "@/stores/cartStore";

export function useCheckoutCart(user) {
  const router = useRouter();
  const { cart: zustandCart } = useCartStore();

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [originalSubtotal, setOriginalSubtotal] = useState(0);
  const [backendTotals, setBackendTotals] = useState({
    totalMRP: 0,
    totalComboDiscount: 0,
    totalMRPDiscount: 0,
    grandTotal: 0,
  });

  // Which cart to display: backend if logged in, else Zustand
  const products = user ? cartItems : zustandCart;

  const totalValue = useMemo(
    () =>
      products.reduce((total, item) => {
        const p = item.product || item;
        const qty = item.quantity || 1;
        const price = p.discount
          ? p.sell_price - (p.discount * p.sell_price) / 100
          : p.sell_price || p.price || 0;
        return total + qty * price;
      }, 0),
    [products]
  );

  const applyLinkedDiscountsToCart = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await apiClient.post("/cart/apply-linked-discounts", {
        userId: user?.id,
      });
      setBackendTotals({
        totalMRP: data.totalMRP || 0,
        totalComboDiscount: data.totalComboDiscount || 0,
        totalMRPDiscount: data.totalMRPDiscount || 0,
        grandTotal: data.grandTotal || 0,
      });
    } catch (err) {
      console.error("Error fetching cart totals:", err);
    }
  }, [user]);

  const fetchCartData = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await apiClient.get("/cart/get", { userId: user?.id });
      const items = Array.isArray(data?.cart)
        ? data.cart
        : Array.isArray(data?.items)
        ? data.items
        : [];

      if (items.length === 0) {
        toast.error("Your cart is empty");
        router.push("/");
        return;
      }

      setCartItems(items);

      const calcSubtotal = items.reduce((sum, item) => {
        const p = item.product || {};
        const qty = item.quantity || 0;
        const original = p.price || 0;
        const discount = p.discount || 0;
        const isFlash = p.isFlash && p.flash;
        let final = original;
        if (isFlash) {
          const f = p.flash;
          if (f.discountType === "PERCENT") {
            final -= (final * f.discountValue) / 100;
          } else if (f.discountType === "FIXED") {
            final -= f.discountValue;
          }
        } else if (discount > 0) {
          final -= (final * discount) / 100;
        }
        final = Math.max(final, 0);
        return sum + Math.round(final) * qty;
      }, 0);

      const orig = items.reduce(
        (sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0),
        0
      );

      setSubtotal(calcSubtotal);
      setOriginalSubtotal(orig);

      await applyLinkedDiscountsToCart();
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart information");
    }
  }, [user, router, applyLinkedDiscountsToCart]);

  useEffect(() => {
    if (user) fetchCartData();
  }, [user, fetchCartData]);

  useEffect(() => {
    if (user && products.length > 0) applyLinkedDiscountsToCart();
  }, [products, user, applyLinkedDiscountsToCart]);

  return {
    products,
    subtotal,
    originalSubtotal,
    totalValue,
    backendTotals,
    refetchCart: fetchCartData,
  };
}