"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import WhatClientSaysCard from "./WhatClientSaysCard";

const WhatClient = ({ testimonials = [] }) => {
  const [testimonialData, setTestimonialData] = useState(testimonials);

  const fallbackData = [
    {
      name: "Ankit Verma",
      location: "Lucknow, Uttar Pradesh",
      initials: "AV",
      message:
        "I ordered a handwoven kurta and honestly, the quality surprised me. It feels authentic and you can see the effort put in by the artisan. Definitely buying again.",
    },
    {
      name: "Sneha Iyer",
      location: "Chennai, Tamil Nadu",
      initials: "SI",
      message:
        "The terracotta decor pieces I received are beautiful and very unique. It's nice to support local artisans while also getting something so elegant for my home.",
    },
    {
      name: "Rahul Chauhan",
      location: "Jaipur, Rajasthan",
      initials: "RC",
      message:
        "Bought a handcrafted leather wallet and the finishing is top-notch. You can feel the difference compared to factory-made products. Worth every rupee.",
    },
  ];

  // Use fetched data or fallback
  const displayData = testimonialData.length > 0 ? testimonialData : fallbackData;

  return (
    <section className="bg-[#0F1E2F] py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs tracking-[0.25em] text-text-yellowText uppercase mb-3">
          What our customers say
        </p>

        <h2 className="text-2xl sm:text-4xl font-semibold text-white">
          Loved across India & beyond
        </h2>

        <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Real stories from people who brought a piece of Indian craft into
          their homes
        </p>

        <div className="mt-12">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {displayData.map((item, index) => (
              <SwiperSlide key={item._id || index}>
                <WhatClientSaysCard data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default WhatClient;