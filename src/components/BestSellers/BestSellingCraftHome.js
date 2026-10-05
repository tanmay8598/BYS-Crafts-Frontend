"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import BestSellingCraftCard from "./BestSellingCraftCard";

function BestSellingCraftHome({ products }) {

  return (
    <section className="py-5 bg-[#F5EFE0]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10  gap-4">
          <div>
            <p className="text-xs tracking-widest text-[#C8A96A] uppercase mb-2">
              Handpicked for you
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Bestselling crafts
            </h2>
          </div>

          <Link
            href="/all-products"
            className="flex items-center gap-2 border border-gray-400 px-4 py-2 rounded-lg text-sm hover:bg-black hover:text-white transition"
          >
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.slice(0, 4).map((item) => (
            <BestSellingCraftCard
              key={item.productDetails._id}
              product={item.productDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSellingCraftHome;
