"use client";

import useAuth from "@/auth/useAuth";
import { remove, updateQuantity } from "@/redux/features/cart/cartSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaMoneyCheck } from "react-icons/fa6";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
// import AccountSidebar from './AccountSidebar';

export default function cartSidebar({ isOpen, onClose, onOpenAccount }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const dispatch = useDispatch();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);
  // const [isOpenAccount, setIsOpenAccount] = useState(false);

  // Get cart from Redux
  const products = useSelector((state) => state.cart.cart);
  const cartLength = products?.length || 0;

  // console.log("op", products)

  // Calculate prices using your existing logic
  const getPrice = (item) => {
    return item?.product?.discount
      ? item.product.sell_price -
          (item.product.discount * item.product.sell_price) / 100
      : item.product.sell_price;
  };

  const subtotal = products.reduce(
    (acc, item) => acc + getPrice(item) * item.quantity,
    0
  );

  const discount = products.reduce((acc, item) => {
    const product = item.product;
    if (!product?.discount) return acc;
    const itemDiscount = (product.discount * product.sell_price) / 100;
    return acc + itemDiscount * item.quantity;
  }, 0);

  const total = subtotal;

  // Get total quantity in cart
  const getTotalCartQuantity = () => {
    return products.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  };

  // Remove item from cart
  const removeSingleItemFromCart = (item) => {
    dispatch(remove(item.product._id));
    toast.success("Item removed from cart!");
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  // Handle quantity change
  const handleQuantityChange = (item, newQuantity, currentQuantity) => {
    if (newQuantity < 1) return;

    // GLOBAL CART LIMIT CHECK (max 4 total items)
    const currentTotalQuantity = getTotalCartQuantity();
    const quantityDifference = newQuantity - currentQuantity;
    const newTotalQuantity = currentTotalQuantity + quantityDifference;

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
      const availableStock = item?.product?.countInStock?.qty || 0;
      if (newQuantity > availableStock) {
        toast.error(`Only ${availableStock} items available in stock`);
        return;
      }
    }

    setUpdatingItem(item.product._id);

    // Simulate async update
    setTimeout(() => {
      dispatch(updateQuantity({ productId: item.product._id, quantity: newQuantity }));
      toast.success(`Quantity updated!`);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      setUpdatingItem(null);
    }, 300);
  };

  // Handle checkout
// Handle checkout
const handleCheckout = () => {
  if (!user) {
    toast.error("Please login to continue");
    onClose(); // Close cart first
    
    // Wait for cart close animation to complete (300ms matches your animation)
    setTimeout(() => {
      onOpenAccount();
    }, 300);
    
    return;
  }

  router.push("/checkout");
  onClose();
};

  // Confetti effect when cart opens
  useEffect(() => {
    if (isOpen && products?.length > 0) {
      import("canvas-confetti").then((confetti) => {
   
  confetti.default({
          particleCount: 60,
          spread: 70,
          origin: { x: 0.8, y: 0.2 },
        });
      });
    }
  }, [isOpen, products?.length]);

  // Empty cart view
  if (cartLength === 0) {
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
                  {cartLength} {cartLength === 1 ? "item" : "items"} in your cart
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
              {products.map((item, index) => {
                const productPrice = getPrice(item);
                const originalPrice = item?.product?.sell_price || 0;
                const hasDiscount = item?.product?.discount > 0;

                return (
                  <motion.div
                    key={item.product._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                    className="bg-white rounded-xl p-3 shadow-sm border border-[#E6DECF] transition-shadow"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item?.product?.image?.[0] || "/placeholder.png"}
                            alt={item?.product?.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {hasDiscount && (
                          <div className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {Math.round(item.product.discount)}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#1E2A38] text-sm line-clamp-2">
                              {item?.product?.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item?.product?.material || "Handcrafted"}
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
                                    item.quantity - 1,
                                    item.quantity
                                  )
                                }
                                disabled={item.quantity <= 1 || updatingItem === item.product._id}
                                className="w-7 h-7 flex cursor-pointer items-center justify-center text-gray-600 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-40"
                              >
                                −
                              </button>

                              <span className="text-sm font-medium w-6 text-center">
                                {updatingItem === item.product._id ? (
                                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                ) : (
                                  item.quantity
                                )}
                              </span>

                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    item.quantity + 1,
                                    item.quantity
                                  )
                                }
                                disabled={
                                  updatingItem === item.product._id ||
                                  item.quantity >= 4 ||
                                  getTotalCartQuantity() >= 4 ||
                                  item.quantity >= (item?.product?.countInStock?.qty || 0)
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
                  <FaMoneyCheck className="text-sm text-primary" />
                  <span>Estimated total</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#1E2A38]">
                    ₹{Math.round(subtotal)}
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
                      <div className="flex justify-between">
                        <span>Subtotal ({cartLength} items)</span>
                        <span>₹{Math.round(subtotal)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-green-600">To be calculated at checkout</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-₹{Math.round(discount)}</span>
                        </div>
                      )}

                      <div className="border-t border-dashed border-[#E6DECF] pt-2 mt-2 flex justify-between font-semibold text-[#1E2A38]">
                        <span>Total</span>
                        <span>₹{Math.round(subtotal)}</span>
                      </div>

                      <p className="text-xs text-gray-400 text-center pt-1">
                        Inclusive of all taxes
                      </p>

                      {discount > 0 && (
                        <div className="bg-[#E9F5EC] text-green-700 text-xs rounded-md px-3 py-2 text-center">
                           You're saving ₹{Math.round(discount)} on this order!
                        </div>
                      )}
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
                  Proceed to checkout
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