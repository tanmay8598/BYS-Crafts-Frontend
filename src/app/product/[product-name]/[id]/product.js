"use client";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
import ProductDetailsCarousel from "@/components/ProductDetailsCarousel/ProductDetailsCarousel";
import ProductStickyBar from "@/components/ProductDetailsCarousel/ProductStickyBar";
import LinkedOffers from "@/components/offers/LinkedOffers";
import Wrapper from "@/components/Wrapper/Wrapper";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import ProductReview from "@/components/Account/ProductReview";
import { FiMinus, FiPlus } from "react-icons/fi";
import useAuth from "@/auth/useAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumb/Breadcrumbs";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FiShield, FiTruck, FiRotateCcw } from "react-icons/fi";
import ReviewSection from "./../../../../components/Review/ReviewSection";
import ReviewModal from "./../../../../components/Review/ReviewModal";
import { useCartStore } from "./../../../../stores/cartStore";
import apiClient from "./../../../../api/client";

export default function ProductPage({ product, related }) {
 
  const router = useRouter();
  const { addToCart, cart: localCart, getTotalQuantity } = useCartStore();
  const { user } = useAuth();
  const [open, setOpen] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const productPrice = product.discount
    ? product.sell_price - (product.discount * product.sell_price) / 100
    : product.sell_price;

  const reviews = product?.reviews || [];
  const totalReviews = reviews.length;

  // Calculate average rating
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      : 0;

  // Calculate rating counts
  const ratingCounts = {
    fiveStar: reviews.filter((r) => r.rating === 5).length,
    fourStar: reviews.filter((r) => r.rating === 4).length,
    threeStar: reviews.filter((r) => r.rating === 3).length,
    twoStar: reviews.filter((r) => r.rating === 2).length,
    oneStar: reviews.filter((r) => r.rating === 1).length,
  };

  const increment = async () => {
    const availableStock = product?.countInStock?.qty || 0;
    const currentTotalQuantity = await getCurrentCartTotal();

    // Check global cart limit first
    if (currentTotalQuantity >= 4) {
      toast.error(
        "Maximum 4 items allowed per order. Please checkout or remove items from cart.",
      );
      return;
    }

    // Check per-product limit
    if (quantity >= 4) {
      toast.error("You can add maximum 4 items of the same product at a time.");
      return;
    }

    // Check stock availability
    if (quantity < availableStock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${availableStock} items available in stock`);
    }
  };

  const decrement = () => quantity > 1 && setQuantity(quantity - 1);

  // Get current total quantity in cart (for logged-in users)
  const getCurrentCartTotal = async () => {
    if (user) {
      try {
        const response = await apiClient.get("/cart/get", {
          userId: user?.id,
        });

        // console.log("count of cart", response)
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

  const addProductToCart = async (product) => {
    // Check individual product limit
    if (quantity > 4) {
      toast.error("You can add maximum 4 items of the same product at a time.");
      return;
    }

    // Get current total quantity in cart
    const currentTotalQuantity = await getCurrentCartTotal();
    const newTotalQuantity = currentTotalQuantity + quantity;

    // GLOBAL CART LIMIT CHECK (max 4 total items)
    if (newTotalQuantity > 4) {
      toast.error(
        `Maximum 4 items allowed per order. You already have ${currentTotalQuantity} item(s) in cart. Cannot add ${quantity} more.`,
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
            qty: quantity,
          },
          type: "increment",
        });

        if (response.ok) {
          toast.success(response.data.message || "Item added to cart!");
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          window.openCartSidebar();
        } else {
          toast.error("Failed to add item to cart");
        }
      } else {
        // User is not logged in - add to Zustand
        addToCart(product, quantity);
        toast.success("Item added to cart!");
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        window.openCartSidebar();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const buyNow = useCallback(async () => {
    if (!user) {
      toast.error("Please login to continue");
      return;
    }

    try {
      // First, add the product to cart
      const response = await apiClient.post("/cart/add", {
        userId: user?.id,
        item: {
          product: product?._id,
          qty: quantity, // Use the current quantity state
        },
        type: "increment",
      });

      if (response.ok) {
        // Navigate to checkout after successful add
        router.push("/checkout");
      } else {
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error in buy now:", error);
      toast.error("Something went wrong");
    }
  }, [user, product, quantity, router]);

  const handleShare = async () => {
    if (!navigator.share) {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
      return;
    }

    await navigator.share({
      title: product?.name,
      url: window.location.href,
    });
  };

  const handleCreateReview = async (formData) => {
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }

    try {
      const response = await apiClient.post("/product/create-product-review", {
        ...formData,
        productId: product._id,
        userId: user.id,
      });

      if (response.ok) {
        toast.success(response.data.message || "Review added successfully");
        setIsReviewModalOpen(false);
      } else {
        toast.error(response.data.message || "Failed to add review");
      }
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error("Something went wrong");
    }
  };

  const openReviewModal = () => {
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }
    setIsReviewModalOpen(true);
  };


  return (
    <section className="bg-[#faf6ed]  min-h-screen">
      <Wrapper>
        <div className="hidden md:flex">
          <Breadcrumbs product={product} />
        </div>

        <div className="flex flex-col px-4  lg:px-10 lg:flex-row gap-10 ">
          <div className="w-full lg:w-[50%] lg:self-start lg:sticky top-10">
            <ProductDetailsCarousel images={product?.image} />
          </div>

          <div className="w-full lg:w-[50%] space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="inline-flex items-center gap-3 px-3 py-2 border border-[#EDE5D3] rounded-full  bg-[#F5EFE0] shadow-sm">
                  <div className="w-8 h-8  rounded-full bg-[#1f3b57] text-white flex items-center justify-center text-xs overflow-hidden">
                    {product?.artisanInfo?.artisan?.image ? (
                      <img
                        src={product?.artisanInfo?.artisan?.image}
                        alt={
                          product?.artisanInfo?.artisan?.fullName || "artisan"
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-medium">
                        {product?.artisanInfo?.artisan?.fullName
                          ?.charAt(0)
                          ?.toUpperCase() || "A"}
                      </span>
                    )}
                  </div>

                <div className="leading-tight">
  <p className="text-sm font-medium text-gray-900">
    {product?.artisanInfo?.artisan?.fullName || 
     product?.artisanInfo?.artisan?.name || 
     "Artisan"}
  </p>
  <p className="text-xs text-gray-500">
    {[
      product?.artisanInfo?.artisan?.location?.address,
      product?.artisanInfo?.artisan?.location?.city,
      product?.artisanInfo?.artisan?.location?.state,
    ]
      .filter(Boolean)
      .join(", ") || "India"}
  </p>
</div>
                </div>
              </div>

              <button onClick={handleShare}>
                <Image src="/share.png" width={30} height={30} alt="share" />
              </button>
            </div>

            <h1 className="text-3xl font-semibold">{product?.name}</h1>

            <ProductReview
              initialRating={product?.rating || 4.9}
              initialTotalReviews={product?.reviews?.length || 128}
            />

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                ₹{productPrice.toLocaleString()}
              </span>

              <span className="line-through text-gray-400 text-sm">
                ₹{product?.sell_price}
              </span>
            </div>

            <div
              className="text-gray-600 text-sm leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{ __html: product?.description }}
            />

            <div id="action-buttons" className="space-y-4">
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-700 font-medium">Qty</span>

                <div className="flex items-center bg-[#f3efe7] rounded-md overflow-hidden border border-[#e5e0d6] h-[36px]">
                  <button
                    onClick={decrement}
                    className="px-4 h-full flex items-center justify-center bg-[#e9e3d6]"
                  >
                    <FiMinus size={14} />
                  </button>

                  <span className="px-5 h-full flex items-center text-gray-800 text-sm font-medium border-x border-[#e5e0d6]">
                    {quantity}
                  </span>

                  <button
                    onClick={increment}
                    className="px-4 h-full flex items-center justify-center bg-[#e9e3d6]"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => addProductToCart(product)}
                  className="bg-[#E0B94B] w-full py-3 rounded-lg font-medium text-sm"
                >
                  Add to cart
                </button>

                <button
                  onClick={buyNow}
                  className="bg-[#1f3b57] text-white w-full py-3 rounded-lg font-medium text-sm"
                >
                  Buy now
                </button>
              </div>
            </div>

            <LinkedOffers
             parentProductId={product?._id}
             parentProduct={product}/>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className="flex items-center gap-3 bg-[#f5efe0] border border-[#e6decf] rounded-lg p-4">
                <FiShield className="text-[#1f3b57]" size={20} />
                <div className="text-xs">
                  <p className="font-medium text-gray-800">Authentic</p>
                  <p className="text-gray-500">GI-tagged product</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#f5efe0] border border-[#e6decf] rounded-lg p-4">
                <FiTruck className="text-[#1f3b57]" size={20} />
                <div className="text-xs">
                  <p className="font-medium text-gray-800">Free shipping</p>
                  <p className="text-gray-500">Orders over ₹1,999</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#f5efe0] border border-[#e6decf] rounded-lg p-4">
                <FiRotateCcw className="text-[#1f3b57]" size={20} />
                <div className="text-xs">
                  <p className="font-medium text-gray-800">Easy returns</p>
                  <p className="text-gray-500">15-day return policy</p>
                </div>
              </div>
            </div>

            <div className="border-b border-[#e6decf] my-6"></div>

            <button
              onClick={() => setOpen(!open)}
              className="w-full flex justify-between items-center text-left"
            >
              <h3 className="font-semibold text-gray-800">Product Details</h3>

              {open ? (
                <FiChevronUp className="text-gray-600" />
              ) : (
                <FiChevronDown className="text-gray-600" />
              )}
            </button>

            {open && (
              <div
                className="mt-4 text-sm text-gray-600 leading-relaxed
                     [&_p]:mb-2
                     [&_strong]:font-semibold
                     [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1"
                dangerouslySetInnerHTML={{
                  __html: product?.specification || product?.details || "",
                }}
              />
            )}
          </div>
        </div>

        <ReviewSection
          reviews={reviews}
          totalReviews={totalReviews}
          averageRating={averageRating}
          ratingCounts={ratingCounts}
          onWriteReview={openReviewModal}
          user={user}
        />
      </Wrapper>
      <RelatedProducts products={related.products} />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={product._id}
        productName={product.name}
        onReviewSubmit={handleCreateReview}
        user={user}
      />

      <ProductStickyBar
        product={product}
        onAddToCart={() => addProductToCart(product)}
        onBuyNow={buyNow}
      />
    </section>
  );
}
