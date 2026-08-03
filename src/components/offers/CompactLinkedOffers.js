"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa";
import { GiPresent } from "react-icons/gi";
import apiClient from "./../../api/client";
import useAuth from "./../../auth/useAuth";
import { useCartStore } from "./../../stores/cartStore";

const CompactLinkedOffers = ({
  parentProductId,
  parentProduct,
  onAddSuccess,
}) => {
  const [linkedOffers, setLinkedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getTotalQuantity } = useCartStore();
  const { user } = useAuth();

  useEffect(() => {
    if (parentProductId) {
      fetchLinkedOffers();
    }
  }, [parentProductId]);

  const fetchLinkedOffers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/linked-offer/get-linked-offers-by-product`,
        {
          productId: parentProductId,
        },
      );

      if (response.data?.offers) {
        setLinkedOffers(response.data.offers.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching linked offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentCartTotal = async () => {
    if (user) {
      try {
        const response = await apiClient.get("/cart/get", {
          userId: user?.id,
        });
        let totalQty = 0;
        if (response.data && Array.isArray(response.data?.cart)) {
          totalQty = response.data.cart.reduce(
            (sum, item) => sum + (item?.quantity || 0),
            0,
          );
        }
        return totalQty;
      } catch (error) {
        return 0;
      }
    } else {
      return getTotalQuantity();
    }
  };

  const addLinkedItemToCart = async (linkedProduct, offer) => {
    const currentTotal = await getCurrentCartTotal();

    if (currentTotal >= 4) {
      toast.error(
        "Maximum 4 items allowed per order. Please checkout or remove items from cart.",
      );
      return;
    }

    try {
      if (user) {
        const response = await apiClient.post("/cart/add-linked-item", {
          userId: user?.id,
          linkedProductId: linkedProduct._id,
          quantity: 1,
          parentProductId: parentProductId,
          linkedOfferId: offer._id,
        });

        if (response.ok) {
          toast.success(
            response.data.message ||
              `${linkedProduct.name} added to cart with special offer!`,
          );

          if (onAddSuccess) {
            await onAddSuccess();
          }
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          if (window.openCartSidebar) window.openCartSidebar();
        } else {
          toast.error(response.data.message || "Failed to add item to cart");
        }
      } else {
        toast.error("Please login to add items");
      }
    } catch (error) {
      console.error("Error adding linked item to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const calculateDiscountedPrice = (product, offer) => {
    const originalPrice = product?.sell_price || product?.price || 0;
    let discountedPrice = originalPrice;

    if (offer.discountType === "percentage") {
      discountedPrice = Math.round(
        originalPrice - (originalPrice * offer.discountValue) / 100,
      );
    } else if (offer.discountType === "flat") {
      discountedPrice = Math.round(originalPrice - offer.discountValue);
    }

    return Math.max(discountedPrice, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#E0B94B] border-t-transparent"></div>
      </div>
    );
  }

  if (linkedOffers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {linkedOffers.map((offer) => {
          const linkedProduct = offer.linkedProduct;
          const originalPrice = linkedProduct?.sell_price || 0;
          const discountedPrice = calculateDiscountedPrice(linkedProduct, offer);
          const savings = originalPrice - discountedPrice;

          const productImage =
            linkedProduct?.image?.[0] ||
            linkedProduct?.images?.[0] ||
            "/placeholder.png";

          return (
            <div
              key={offer._id}
              className="flex items-center gap-2 bg-white rounded-xl p-2 border border-gray-200"
            >
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src={productImage}
                  alt={linkedProduct?.name || "Product"}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                  {linkedProduct?.name || "Product"}
                </p>
                <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                  {originalPrice > 0 && (
                    <span className="text-[10px] line-through text-gray-400">
                      ₹{originalPrice}
                    </span>
                  )}
                  <span className="text-xs font-bold text-[#2E7D32]">
                    ₹{discountedPrice}
                  </span>
                  <span className="text-[9px] text-[#E0B94B]">
                    (Save ₹{savings})
                  </span>
                </div>
              </div>

              <button
                onClick={() => addLinkedItemToCart(linkedProduct, offer)}
                className="shrink-0 text-xs bg-[#E0B94B] text-[#1f3b57] px-3 py-1.5 rounded-lg font-medium hover:bg-[#d4a83f] transition-colors cursor-pointer"
              >
                + Add
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-400">
        <FaLock className="w-2 h-2" />
        <span>Only with this order</span>
      </div>
    </div>
  );
};

export default CompactLinkedOffers;