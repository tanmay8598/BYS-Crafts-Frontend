
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const ProductStickyBar = ({ product, onAddToCart, onBuyNow }) => {
  const [show, setShow] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const isInStock = product?.countInStock?.qty > 0;
  const originalPrice = product?.sell_price || 0;
  const discount = product?.discount || 0;

  const discountedPrice =
    discount > 0
      ? Math.round(originalPrice - (originalPrice * discount) / 100)
      : originalPrice;

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let observer;

    // Target the action buttons section
    const target = document.getElementById("action-buttons");

    if (target) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (isDesktop) {
            //  FIX: Check if the element is above the viewport (fully scrolled past)
            // and not just partially out of view
            const rect = entry.boundingClientRect;
            const isFullyScrolledPast = rect.bottom < 0;
            const isPartiallyVisible = rect.top < 0 && rect.bottom > 0;
            
            // Show sticky bar only when the element is FULLY scrolled past (bottom is above viewport)
            // AND not partially visible
            const shouldShow = isFullyScrolledPast && !isPartiallyVisible;
            setShow(shouldShow);
          } else {
            setShow(!entry.isIntersecting);
          }
        },
        {
          threshold: 0,
          rootMargin: "0px 0px -50px 0px", // Adds a small buffer
        },
      );

      observer.observe(target);
    }

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [isDesktop]);

  const productImage = product?.image?.[0] || product?.images?.[0];

  return (
    <>
      {/* MOBILE BOTTOM BAR */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 w-full z-20 rounded-2xl bg-white px-4 py-3 font-figtree 
        shadow-[0_-2px_10px_rgba(0,0,0,0.06)]
        transition-all duration-300 ease-in-out
        ${
          show
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {productImage && (
              <Image
                src={productImage}
                alt={product?.name || "Product"}
                width={40}
                height={40}
                className="object-contain rounded-md"
              />
            )}

            <div className="flex flex-col min-w-0">
              <p className="text-xs font-medium text-gray-900 line-clamp-1">
                {product?.name}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  ₹{discountedPrice}
                </span>

                {discount > 0 && (
                  <span className="text-xs line-through text-gray-400">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
              <p className="text-[8px] text-gray-500">Inclusive of all taxes</p>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!isInStock}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm
              ${
                isInStock
                  ? "bg-[#E0B94B] text-[#1f3b57]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Add To Cart
          </button>
        </div>
      </div>

      {/* DESKTOP TOP BAR */}
      <div
        className={`hidden lg:flex fixed top-[88px] left-0 w-full z-20 
        bg-[#FFF7F3] border-b border-[#f1d2c7] px-8 py-3 
        items-center justify-between font-figtree shadow-sm
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        transform
        ${
          show
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-4">
          {productImage && (
            <Image
              src={productImage}
              alt={product?.name || "Product"}
              width={45}
              height={45}
              className="object-contain rounded-md"
            />
          )}

          <div className="flex flex-col">
            <p className="text-sm font-medium line-clamp-1 text-gray-900">
              {product?.name}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">
                ₹{discountedPrice}
              </span>

              {discount > 0 && (
                <span className="text-xs line-through text-gray-400">
                  ₹{originalPrice}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">Inclusive of all taxes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onBuyNow(product)}
            disabled={!isInStock}
            className={`px-5 py-2.5 cursor-pointer rounded-xl font-semibold text-sm
              ${
                isInStock
                  ? "border border-[#1f3b57] text-[#1f3b57]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            {isInStock ? "Buy It Now" : "Out of Stock"}
          </button>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!isInStock}
            className={`px-6 py-2.5 cursor-pointer rounded-xl font-semibold text-sm
              ${
                isInStock
                  ? "bg-[#E0B94B] text-[#1f3b57]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductStickyBar;