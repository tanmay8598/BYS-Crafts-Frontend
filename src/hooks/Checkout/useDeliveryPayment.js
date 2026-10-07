"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "@/api/client";

export function useDeliveryPayment(selectedPaymentMethod, cartTotal) {
  const [deliveryPrices, setDeliveryPrices] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [codHandlingCharge, setCodHandlingCharge] = useState(0);

  const fetchDeliveryPrices = useCallback(async () => {
    try {
      const res = await apiClient.get("/delivery-fee/get", {
        paymentMethod: selectedPaymentMethod === "online" ? "PREPAID" : "COD",
      });
      if (res.ok && res.data?.data) {
        setDeliveryPrices(res.data.data);
        setExtraDiscount(res.data.data.extraDiscount || 0);
        setCodHandlingCharge(res.data.data.codHandlingCharge || 0);
      }
    } catch (err) {
      console.error("Error fetching delivery prices:", err);
    }
  }, [selectedPaymentMethod]);

  useEffect(() => {
    fetchDeliveryPrices();
  }, [fetchDeliveryPrices]);

  useEffect(() => {
    if (!deliveryPrices) {
      setDeliveryFee(0);
      return;
    }
    const { feeStrategy, feeAmount, freeThreshold } = deliveryPrices;
    if (feeStrategy === "FREE") setDeliveryFee(0);
    else if (feeStrategy === "CONDITIONAL")
      setDeliveryFee(cartTotal >= freeThreshold ? 0 : feeAmount);
    else if (feeStrategy === "FIXED") setDeliveryFee(feeAmount);
    else setDeliveryFee(0);
  }, [cartTotal, deliveryPrices]);

  return { deliveryFee, extraDiscount, codHandlingCharge };
}