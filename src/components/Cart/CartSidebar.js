

"use client";

import apiClient from './../../api/client';
import useAuth from './../../auth/useAuth';
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaMoneyCheck } from "react-icons/fa6";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { useCartStore } from './../../stores/cartStore';

export default function CartSidebar({ isOpen, onClose, onOpenAccount }) {
  const router = useRouter();
  
  const { user } = useAuth();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [backendCartData, setBackendCartData] = useState([]);
  
  // Delivery and discount states
  const [deliveryPrices, setDeliveryPrices] = useState(null);
  const [prepaidDeliveryPrices, setPrepaidDeliveryPrices] = useState(null);
  const [codDeliveryPrices, setCodDeliveryPrices] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [extraDiscount, setExtraDiscount] = useState(0);
  const [codHandlingCharge, setCodHandlingCharge] = useState(0);
  const [activeDiscountType, setActiveDiscountType] = useState(null);

  // Backend totals
  const [backendTotals, setBackendTotals] = useState({
    totalMRP: 0,
    totalComboDiscount: 0,
    totalMRPDiscount: 0,
    grandTotal: 0,
  });

  const {
    cart: localCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    syncCartToBackend,
    getTotalQuantity,
  } = useCartStore();

  // Merge local and backend carts
  const cartData = user ? backendCartData : localCart;

  // Get total quantity in cart
  const getTotalCartQuantity = () => {
    if (!Array.isArray(cartData)) return 0;
    return cartData.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  };

  // Calculate local cart totals (for non-logged in users)
  const getLocalCartTotals = () => {
    if (!Array.isArray(localCart) || localCart.length === 0) {
      return {
        totalMRP: 0,
        totalMRPDiscount: 0,
        totalComboDiscount: 0,
        grandTotal: 0,
      };
    }

    let totalMRP = 0;
    let totalMRPDiscount = 0;

    localCart.forEach((item) => {
      const product = item?.product || item;
      const price = product?.sell_price || product?.price || 0;
      const discount = product?.discount || 0;
      const qty = item?.quantity || 1;

      totalMRP += price * qty;
      totalMRPDiscount += ((price * discount) / 100) * qty;
    });

    const grandTotal = totalMRP - totalMRPDiscount;

    return {
      totalMRP,
      totalMRPDiscount,
      totalComboDiscount: 0,
      grandTotal,
    };
  };

  // Get product from item
  const getProduct = (item) => {
    return item?.product || item;
  };

  // Get item ID
  const getItemId = (item) => {
    return item?._id || item?.id || item?.product?._id || item?.product?.id;
  };

  // Get local totals
  const localTotals = getLocalCartTotals();
  const cartTotal = user ? backendTotals.grandTotal : localTotals.grandTotal;

  // Fetch delivery prices
  const getDeliveryPrices = async () => {
    try {
      // Fetch PREPAID delivery settings
      const prepaidResponse = await apiClient.get("/delivery-fee/get", {
        paymentMethod: "PREPAID",
      });
      
      // Fetch COD delivery settings
      const codResponse = await apiClient.get("/delivery-fee/get", {
        paymentMethod: "COD",
      });

      let prepaidData = null;
      let codData = null;

      if (prepaidResponse.ok && prepaidResponse.data?.data) {
        prepaidData = prepaidResponse.data.data;
        setPrepaidDeliveryPrices(prepaidData);
      }
      
      if (codResponse.ok && codResponse.data?.data) {
        codData = codResponse.data.data;
        setCodDeliveryPrices(codData);
      }

      // Priority: PREPAID extraDiscount > COD extraDiscount > Nothing
      if (prepaidData && prepaidData.extraDiscount > 0) {
        setDeliveryPrices(prepaidData);
        setExtraDiscount(prepaidData.extraDiscount || 0);
        setCodHandlingCharge(0);
        setActiveDiscountType("PREPAID");
      } else if (codData && codData.extraDiscount > 0) {
        setDeliveryPrices(codData);
        setExtraDiscount(codData.extraDiscount || 0);
        setCodHandlingCharge(codData.codHandlingCharge || 0);
        setActiveDiscountType("COD");
      } else {
        setDeliveryPrices(prepaidData || codData || null);
        setExtraDiscount(0);
        setCodHandlingCharge(0);
        setActiveDiscountType(null);
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

  // Apply linked discounts to cart (backend)
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

  // Fetch cart from backend
  const getCartCount = async () => {
    if (!user) return;
 
    try {
      const response = await apiClient.get("/cart/get", {
        userId: user?.id,
      });
      console.log("cart get res...", response)

      let backendItems = [];
      if (response.data && Array.isArray(response.data?.cart)) {
        backendItems = response.data.cart;
      } else if (response.data && Array.isArray(response.data)) {
        backendItems = response.data;
      } else if (response.data && response.data.cart) {
        backendItems = response.data.cart || [];
      }

      setBackendCartData(backendItems);
      
      // After fetching cart, apply discounts
      if (backendItems.length > 0) {
        await applyLinkedDiscountsToCart();
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setBackendCartData([]);
    }
  };

  // Remove item from cart
  const removeSingleItemFromCart = async (item) => {
    const itemId = getItemId(item);
    
    if (user) {
      try {
        const response = await apiClient.delete("/cart/remove", {
          cartItemId: item._id,
        });

        if (response.ok) {
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          await getCartCount();
          await applyLinkedDiscountsToCart();
          toast.success(response.data.message || "Item removed!");
        } else {
          toast.error("Failed to remove item");
        }
      } catch (error) {
        console.error("Error removing item:", error);
        toast.error("Failed to remove item");
      }
    } else {
      removeFromCart(itemId || item._id);
      toast.success("Item removed from cart!");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (
    cartItem,
    newQuantity,
    currentQuantity
  ) => {
    if (newQuantity < 1) return;

    // Calculate current total cart quantity
    const currentTotalQuantity = getTotalCartQuantity();
    const quantityDifference = newQuantity - currentQuantity;
    const newTotalQuantity = currentTotalQuantity + quantityDifference;

    // GLOBAL CART LIMIT CHECK (max 4 total items)
    if (newQuantity > currentQuantity && newTotalQuantity > 4) {
      toast.error(
        "Maximum 4 items allowed per order. Please remove some items before adding more."
      );
      return;
    }

    if (newQuantity > currentQuantity && newQuantity > 4) {
      toast.error(
        "You can add maximum 4 items of the same product. For larger quantities, please create another order."
      );
      return;
    }

    // Check stock availability
    if (newQuantity > currentQuantity) {
      const product = getProduct(cartItem);
      const availableStock = product?.countInStock?.qty || 
                            product?.countInStock?.quantity || 0;
      if (newQuantity > availableStock) {
        toast.error(`Only ${availableStock} items available in stock`);
        return;
      }
    }

    const itemId = getItemId(cartItem);
    setUpdatingItem(itemId);

    try {
      if (user) {
        const type = newQuantity > currentQuantity ? "increment" : "decrement";
        const product = getProduct(cartItem);

        const response = await apiClient.post("/cart/add", {
          userId: user?.id,
          item: {
            product: product?._id || product?.id,
            qty: Math.abs(newQuantity - currentQuantity),
          },
          type: type,
        });

        if (response.ok) {
          window.dispatchEvent(new CustomEvent("cartUpdated"));
          await getCartCount();
          await applyLinkedDiscountsToCart();
          toast.success(
            response.data.message ||
              `Quantity ${type === "increment" ? "increased" : "decreased"}!`
          );
        } else {
          toast.error("Failed to update quantity");
        }
      } else {
        if (newQuantity > currentQuantity) {
          increaseQty(itemId);
        } else {
          decreaseQty(itemId);
        }
        toast.success(`Quantity updated!`);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to continue");
      onClose();

      setTimeout(() => {
        if (onOpenAccount) {
          onOpenAccount();
        }
      }, 300);

      return;
    }

    router.push("/checkout");
    onClose();
  };

  // Sync cart when user logs in
  useEffect(() => {
    if (user && localCart?.length > 0) {
      const syncCart = async () => {
        const success = await syncCartToBackend(user.id, apiClient);
        if (success) {
          await getCartCount();
        }
      };
      syncCart();
    }
  }, [user]);

  // Fetch cart when user logs in or cart opens
  useEffect(() => {
    if (user && isOpen) {
      getCartCount();
    }
  }, [user, isOpen]);

  // Fetch delivery prices on mount
  useEffect(() => {
    getDeliveryPrices();
  }, []);

  // Recalculate delivery fee when cart total or delivery prices change
  useEffect(() => {
    const total = user ? backendTotals.grandTotal : localTotals.grandTotal;
    const fee = calculateDeliveryFee(total);
    setDeliveryFee(fee);
  }, [backendTotals.grandTotal, localTotals.grandTotal, deliveryPrices]);

  // Apply linked discounts when backend cart changes
  useEffect(() => {
    if (user && backendCartData.length > 0) {
      applyLinkedDiscountsToCart();
    }
  }, [user, backendCartData]);

  // Confetti effect when cart opens
  useEffect(() => {
    if (isOpen && cartData?.length > 0) {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 60,
          spread: 70,
          origin: { x: 0.8, y: 0.2 },
        });
      });
    }
  }, [isOpen, cartData?.length]);

  // Calculate grand total with all fees and discounts
  const calculateGrandTotal = () => {
    const baseTotal = user ? backendTotals.grandTotal : localTotals.grandTotal;
    const discountAmount = (baseTotal * (extraDiscount || 0)) / 100;
    const codCharge = activeDiscountType === "COD" ? codHandlingCharge : 0;
    return baseTotal + deliveryFee + codCharge - discountAmount;
  };

  // Empty cart view
  if (!cartData || cartData.length === 0) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[400px] md:w-[450px] bg-[#F7F3EA] z-50 flex flex-col shadow-2xl rounded-tl-3xl rounded-bl-3xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 bg-white border-b border-[#E6DECF] rounded-tl-4xl">
                <h2 className="font-semibold text-xl text-[#1E2A38]">
                  Your Cart
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <IoClose className="text-xl cursor-pointer text-gray-600" />
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-32 h-32 mb-6 relative"
                >
                  <div className="absolute inset-0 bg-[#E56A5C]/10 rounded-full"></div>
                  <div className="absolute inset-3 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiShoppingBag className="text-5xl text-[#E56A5C]" />
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-[#1E2A38] mb-2"
                >
                  Your Cart is Empty
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-500 mb-8"
                >
                  Looks like you haven't added anything yet
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    router.push("/all-products");
                  }}
                  className="bg-btnBg-secondary px-6 py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  Continue Shopping
                  <FiArrowRight className="text-lg" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Cart with items
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] md:w-[450px] bg-[#F7F3EA] z-50 flex flex-col shadow-2xl rounded-tl-4xl rounded-bl-4xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 bg-white border-b border-[#E6DECF] rounded-tl-4xl">
              <div>
                <h2 className="font-bold text-xl text-[#1E2A38]">Your Cart</h2>
                <p className="text-sm text-gray-500">
                  {cartData.length} {cartData.length === 1 ? "item" : "items"} in your cart
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoClose className="text-xl cursor-pointer text-gray-600" />
              </button>
            </div>

            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
              {cartData.map((item) => {
                const product = getProduct(item);
                const productPrice = product?.sell_price || product?.price || 0;
                const originalPrice = product?.sell_price || product?.price || 0;
                const hasDiscount = product?.discount > 0;
                const itemId = getItemId(item);

                // Get image - handle different image structures
                const productImage = product?.image?.[0] || 
                                    product?.images?.[0] || 
                                    "/placeholder.png";

                return (
                  <motion.div
                    key={itemId || Math.random().toString()}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    className="bg-white rounded-xl p-3 shadow-sm border border-[#E6DECF] transition-shadow"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 relative">
                          <Image
                            src={productImage}
                            alt={product?.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {hasDiscount && (
                          <div className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {Math.round(product.discount)}% 
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#1E2A38] text-sm line-clamp-2">
                              {product?.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {product?.material || "Handcrafted"}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            {hasDiscount ? (
                              <div className="flex flex-col items-end">
                                <span className="font-bold text-primary text-base">
                                  ₹{Math.round(productPrice)}
                                </span>
                                <span className="text-xs line-through text-gray-400">
                                  ₹{Math.round(originalPrice)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-[#1E2A38] text-base">
                                ₹{Math.round(productPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-2">
                            {/* Delete Button */}
                            <button
                              onClick={() => removeSingleItemFromCart(item)}
                              className="w-8 h-8 flex cursor-pointer items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-500 transition"
                            >
                              <IoTrashOutline size={16} />
                            </button>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-2 py-1">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    (item?.quantity || 1) - 1,
                                    item?.quantity || 1
                                  )
                                }
                                disabled={
                                  (item?.quantity || 1) <= 1 ||
                                  updatingItem === itemId
                                }
                                className="w-7 h-7 flex cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-40"
                              >
                                −
                              </button>

                              <span className="text-sm font-medium w-6 text-center">
                                {updatingItem === itemId ? (
                                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                ) : (
                                  item?.quantity || 1
                                )}
                              </span>

                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    (item?.quantity || 1) + 1,
                                    item?.quantity || 1
                                  )
                                }
                                disabled={
                                  updatingItem === itemId ||
                                  (item?.quantity || 1) >= 4 ||
                                  getTotalCartQuantity() >= 4 ||
                                  (item?.quantity || 1) >=
                                    (product?.countInStock?.qty ||
                                     product?.countInStock?.quantity ||
                                     0)
                                }
                                className="w-7 h-7 flex cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-40"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary Footer */}
            <div className="bg-white border-t border-[#E6DECF] shadow-lg rounded-bl-4xl">
              {/* Estimated Total - Click to expand */}
              <div
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaMoneyCheck className="text-xl text-primary" />
                  <span>Estimated total</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#1E2A38]">
                    ₹{Math.round(calculateGrandTotal())}
                  </span>
                  {showBreakdown ? (
                    <FaChevronUp className="text-gray-500 text-sm" />
                  ) : (
                    <FaChevronDown className="text-gray-500 text-sm" />
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <AnimatePresence>
                {showBreakdown && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-5 pb-4 text-sm text-gray-600"
                  >
                    <div className="border-t border-dashed border-[#E6DECF] pt-3 space-y-2">
                      {/* Total MRP */}
                      <div className="flex justify-between">
                        <span>Total MRP</span>
                        <span>
                          ₹{Math.round(
                            user ? backendTotals.totalMRP : localTotals.totalMRP
                          )}
                        </span>
                      </div>

                      {/* Product Internal Discounts */}
                      {(user ? backendTotals.totalMRPDiscount : localTotals.totalMRPDiscount) > 0 && (
                        <div className="flex justify-between">
                          <span>Discount on MRP</span>
                          <span className="text-green-700">
                            -₹{Math.round(
                              user ? backendTotals.totalMRPDiscount : localTotals.totalMRPDiscount
                            )}
                          </span>
                        </div>
                      )}

                      {/* Combo Savings */}
                      {backendTotals.totalComboDiscount > 0 && (
                        <div className="flex justify-between items-center bg-primary-100 p-2 rounded-lg -mx-2 px-2">
                          <div className="flex flex-col">
                            <span className="text-primary-400 font-medium">
                              Combo Savings
                            </span>
                            <span className="text-xs text-gray-500">
                              Additional discount on combo items
                            </span>
                          </div>
                          <span className="text-primary-400 font-bold">
                            -₹{Math.round(backendTotals.totalComboDiscount)}
                          </span>
                        </div>
                      )}

                      {/* Delivery Fee */}
                      <div className="flex justify-between items-center">
                        <span>Delivery fee</span>
                        <span>
                          {deliveryFee === 0 ? (
                            <span className="font-regular">
                              FREE shipping {activeDiscountType ? `(${activeDiscountType})` : ""}
                            </span>
                          ) : (
                            `₹${deliveryFee}`
                          )}
                        </span>
                      </div>

                      {/* Extra Discount - Prepaid */}
                      {extraDiscount > 0 && activeDiscountType === "PREPAID" && (
                        <div className="flex justify-between items-center bg-primary-50 p-2 rounded-lg -mx-2 px-2">
                          <div className="flex flex-col">
                            <span className="text-primary-400 font-medium">Prepaid Discount</span>
                            <span className="text-xs text-gray-500">Prepaid discount applied</span>
                          </div>
                          <span className="text-primary-400 font-bold">-{extraDiscount}%</span>
                        </div>
                      )}

                      {/* Extra Discount - COD */}
                      {extraDiscount > 0 && activeDiscountType === "COD" && (
                        <div className="flex justify-between items-center bg-primary-50 p-2 rounded-lg -mx-2 px-2">
                          <div className="flex flex-col">
                            <span className="text-primary-400 font-medium">Special Discount</span>
                            <span className="text-xs text-gray-500">Special discount applied</span>
                          </div>
                          <span className="text-primary-400 font-bold">-{extraDiscount}%</span>
                        </div>
                      )}

                      {/* COD Handling Charge */}
                      {codHandlingCharge > 0 && activeDiscountType === "COD" && (
                        <div className="flex justify-between items-center">
                          <span>COD Handling Charge</span>
                          <span className="text-warning">+₹{codHandlingCharge}</span>
                        </div>
                      )}

                      {/* Grand Total */}
                      <div className="border-t border-dashed border-[#E6DECF] pt-2 mt-2 flex justify-between font-semibold text-[#1E2A38]">
                        <span>Grand total</span>
                        <span>
                          ₹{Math.round(calculateGrandTotal())}
                        </span>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Checkout Button */}
              <div className="px-5 pb-5">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-btnBg-secondary py-3.5 rounded-lg font-semibold text-base shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
                >
                  Checkout
                  <FiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}