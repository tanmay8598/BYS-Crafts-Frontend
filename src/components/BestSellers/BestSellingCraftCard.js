"use client";

import { Heart, Star, ShoppingCart } from "lucide-react";
import Link from "next/link";
import useAuth from "./../../auth/useAuth";
import apiClient from "./../../api/client";
import toast from "react-hot-toast";
import { useCartStore } from "./../../stores/cartStore";

const BestSellingCraftCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart, getTotalQuantity } = useCartStore();
  const { name, image, sell_price, discount, rating, artisanInfo } = product;

  const finalPrice = sell_price - (sell_price * discount) / 100;

  const slugify = (text) =>
    text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  const productSlug = slugify(product.name);

  // Get current total quantity in cart
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
        console.error("Error fetching cart:", error);
        return 0;
      }
    } else {
      return getTotalQuantity(); // Use Zustand's getTotalQuantity
    }
  };

  const addToWishlist = async () => {
    if (!user?.id) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }

    const response = await apiClient.post("/wishlist/create", {
      user: user?.id,
      items: [{ product, qty: 1 }],
    });

    response.ok
      ? toast.success("Item added to wishlist")
      : toast.error("Failed to add item to wishlist");
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const qty = 1;

    // Check individual product limit
    if (qty > 4) {
      toast.error("You can add maximum 4 items of the same product at a time.");
      return;
    }

    // Get current total quantity in cart
    const currentTotalQuantity = await getCurrentCartTotal();
    const newTotalQuantity = currentTotalQuantity + qty;

    // GLOBAL CART LIMIT CHECK (max 4 total items)
    if (newTotalQuantity > 4) {
      toast.error(
        `Maximum 4 items allowed per order. You already have ${currentTotalQuantity} item(s) in cart. Cannot add more.`,
      );
      return;
    }

    try {
      if (user) {
        // User is logged in - add to backend
        const response = await apiClient.post("/cart/add", {
          userId: user?.id,
          item: {
            product: product?._id,
            qty: qty,
          },
          type: "increment",
        });

        if (response.ok) {
          toast.success(response.data.message || "Item added to cart!");
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          // Open cart sidebar if available
          if (typeof window !== 'undefined' && window.openCartSidebar) {
            window.openCartSidebar();
          }
        } else {
          toast.error("Failed to add item to cart");
        }
      } else {
        // User is not logged in - add to Zustand
        addToCart(product, qty);
        toast.success("Item added to cart!");
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        // Open cart sidebar if available
        if (typeof window !== 'undefined' && window.openCartSidebar) {
          window.openCartSidebar();
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <Link href={`/product/${productSlug}/${product._id}`} className="h-full">
      <div className="bg-[#FAF6ED] rounded-xl overflow-hidden border border-[#1B3A5C0F] transition flex flex-col h-full">
        {/* Image Section */}
        <div className="relative bg-[#eae2d6] aspect-square overflow-hidden">
          {discount > 0 && (
            <span className="absolute top-3 left-3 text-xs bg-red-500 text-white px-2 py-1 rounded">
              {discount}% off
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToWishlist();
            }}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow"
          >
            <Heart size={16} />
          </button>

          <img
            src={image?.[0]}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          <div className="space-y-2 min-h-[110px]">
            <p className="text-xs text-text-yellowText">
              By {artisanInfo?.artisan?.fullName || "Artisan"}
            </p>

            <h3 className="text-sm font-medium text-text-primaryText line-clamp-2 min-h-[40px]">
              {name}
            </h3>

            <p className="text-xs text-text-secondaryText line-clamp-2 min-h-[32px]">
              {artisanInfo?.artisanDescription || ""}
            </p>
          </div>

          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold font-sans text-[#0F1E2F]">
                  ₹{finalPrice.toFixed(0)}
                </span>

                {discount > 0 && (
                  <span className="line-through text-gray-400 text-xs">
                    ₹{sell_price}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-text-secondaryText">
                <Star size={14} className="fill-[#E8C547] text-[#E8C547]" />
                {rating || 4.5}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full mt-3 bg-[#1f3b57] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#2a4a6a] transition flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BestSellingCraftCard;