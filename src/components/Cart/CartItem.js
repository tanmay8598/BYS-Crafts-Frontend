"use client";

import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";

import {
  decrementQuantity,
  incrementQuantity,
  remove,
} from "@/redux/features/cart/cartSlice";

const CartPageItem = ({ item }) => {
  const dispatch = useDispatch();
  const product = item.product;

  const price = product.discount
    ? product.sell_price -
      (product.discount * product.sell_price) / 100
    : product.sell_price;

  const total = price * item.quantity;

  const handleRemove = () => {
    dispatch(remove(product._id));
  };

  const handleIncrement = () => {
    if (item.quantity < product?.countInStock?.qty) {
      dispatch(incrementQuantity(product._id));
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      dispatch(decrementQuantity(product._id));
    }
  };

  return (
   <div className="flex gap-5 py-6  border-b-2 border-[#EDE5D3] bg-bg-light">

<div className="w-[100px] h-[100px] bg-bg-light rounded-lg overflow-hidden">
        {product?.image?.[0] ? (
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">

        <div className="flex justify-between">
          <div>
            <p className="text-xs text-[#C8A96A] mb-1">
              By{" "}
              {product?.artisanInfo?.artisan?.fullName ||
                "Ramesh Kumar, Jaipur"}
            </p>

            <h3 className="text-[15px] font-medium text-[#1E2A38] ">
              {product.name}
            </h3>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-semibold text-[#1E2A38]">
                ₹{price.toLocaleString()}
              </span>

              {(product?.discount && product?.discount > 0) && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product?.sell_price}
                </span>
              )}
            </div>
          </div>

        
        </div>

        <div className="flex items-center gap-4 mt-3">

          <div className="flex items-center border border-[#E6DECF] rounded-md overflow-hidden">
            
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="px-3 py-1 bg-[#F3EFE7] disabled:opacity-40"
            >
              <FiMinus size={14} />
            </button>

            <span className="px-4 text-sm font-medium">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrement}
              disabled={item.quantity >= product?.countInStock?.qty}
              className="px-3 py-1 bg-[#F3EFE7] disabled:opacity-40"
            >
              <FiPlus size={14} />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="text-xs text-gray-500 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-sm font-semibold text-[#1E2A38] whitespace-nowrap">
        ₹{total.toLocaleString()}
      </div>
    </div>
  );
};

export default CartPageItem;