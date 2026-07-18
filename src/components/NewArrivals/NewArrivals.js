"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import BestSellingCraftCard from "./../BestSellers/BestSellingCraftCard";

const NewArrivals = ({products}) => {
  const swiperRef = useRef(null);
  const enoughForNav = products?.length > 4;

  return (
    <section className="py-5 bg-[#F5EFE0]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest text-[#C8A96A] uppercase mb-2">
              Fresh picks
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              New Arrivals
            </h2>
          </div>

          <Link
            href="/new-arrivals"
            className="flex items-center gap-2 border border-gray-400 px-4 py-2 rounded-lg text-sm hover:bg-black hover:text-white transition"
          >
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative">
          {enoughForNav && (
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={products.length > 4}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {products?.slice(0, 8).map((product) => (
              <SwiperSlide key={product._id}>
                <BestSellingCraftCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {enoughForNav && (
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
