"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FiShield, FiTruck, FiTrendingUp, FiMessageSquare } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

function Hero() {
  const router = useRouter();
  return (
    <section className="bg-[#faf6ed] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 py-6 lg:py-12 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-5 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-block border border-[#E8C547] text-text-yellowText text-xs md:text-sm px-4 py-2 rounded-full mb-5 bg-[#F5EFE0]">
            ⭐ Trusted by 12,000+ customers
          </div>  

          <h1 className="text-3xl lg:text-5xl font-bold text-text-primaryText leading-tight">
            Where every craft <br />
            tells an{" "}
            <span className="text-text-redText italic font-bold">
              ancient story
            </span>
          </h1>

          <p className="text-text-secondaryText mt-4 max-w-md mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed">
            Discover India’s finest handcrafted treasures — from Rajasthani
            block prints to Banarasi silk, each piece carries centuries of
            artisan heritage to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row  mt-5 justify-center lg:justify-start">
         <button 
            onClick={() => router.push("/collections")}
         className="bg-[#1E3A5F] text-white px-6 py-3 rounded-md text-sm font-medium inline-flex items-center justify-center gap-2">
  Explore collections
  <FaArrowRight className="text-sm" />
</button>
          </div>

          <div className="flex justify-center  lg:justify-start gap-8 mt-8 text-sm ">
            <div>
              <p className="text-3xl font-semibold font-playfair   text-[#1E1E1E]">500+</p>
              <p className="text-text-secondaryText text-xs">Artisan partners</p>
            </div>
            <div>
              <p className="text-3xl font-semibold font-playfair   text-[#1E1E1E]">28</p>
              <p className="text-text-secondaryText text-xs">States represented</p>
            </div>
            <div>
              <p className="text-3xl font-semibold font-playfair   text-[#1E1E1E]">4.9</p>
              <p className="text-text-secondaryText text-xs">Customer rating</p>
            </div>
          </div>
        </div>

        {/* RIGHT CARDS */}

        <div className="flex justify-center lg:pr-28 lg:justify-end w-full">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 scale-90 sm:scale-100">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="bg-[#254765] text-white p-4 sm:p-5 rounded-2xl w-36 sm:w-40 h-44 sm:h-48 flex flex-col justify-between shadow-md">
                <div className="flex flex-col items-center justify-center flex-1 opacity-80">
                  <img
                    src="https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md mb-2 sm:mb-3"
                  />
                  <p className="text-[10px] sm:text-xs text-center">
                    Block print textile
                  </p>
                </div>
                <div className="text-[10px] sm:text-xs bg-[#0f2d4a] px-2 py-1 rounded-md w-fit mx-auto">
                  Jaipur, Rajasthan
                </div>
              </div>

              <div className="bg-[#E8DECE] p-4 sm:p-5 rounded-2xl w-36 sm:w-40 h-44 sm:h-48 flex flex-col justify-between shadow-md">
                <div className="flex flex-col items-center justify-center flex-1 opacity-60">
                  <img
                    src="https://images.pexels.com/photos/6311657/pexels-photo-6311657.jpeg"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md mb-2 sm:mb-3"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-600 text-center">
                    Pashmina shawl
                  </p>
                </div>
                <div className="text-[10px] sm:text-xs bg-gray-700 text-white px-2 py-1 rounded-md w-fit mx-auto">
                  Kashmir
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="bg-[#E8DECE] p-4 sm:p-5 rounded-2xl w-36 sm:w-40 h-44 sm:h-48 flex flex-col justify-between shadow-md">
                <div className="self-end bg-[#E8C547] text-[10px] sm:text-xs px-3 py-1 rounded-[6px] font-medium">
                  ₹1,299
                </div>
                <div className="flex flex-col items-center justify-center flex-1 opacity-60">
                  <img
                    src="https://images.pexels.com/photos/6207367/pexels-photo-6207367.jpeg"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md mb-2 sm:mb-3"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-600 text-center">
                    Brass diya set
                  </p>
                </div>
              </div>

              <div className="bg-[#10283E] text-white p-4 sm:p-5 rounded-2xl w-36 sm:w-40 h-44 sm:h-48 flex flex-col justify-between shadow-md">
                <div className="self-end bg-[#E8C547] text-[10px] sm:text-xs px-3 py-1 rounded-[6px] text-black font-medium">
                  ₹899
                </div>
                <div className="flex flex-col items-center justify-center flex-1 opacity-80">
                  <img
                    src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md mb-2 sm:mb-3"
                  />
                  <p className="text-[10px] sm:text-xs text-center">
                    Dokra jewelry
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <div className="bg-[#0F1E2F] text-white py-4">
<div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center lg:justify-between gap-6">

    <div className="flex items-center gap-4">
      <FiShield className="text-yellow-400 text-lg" />
      <p className="text-sm text-[#FFFFFFB2]">
        100% authentic handmade
      </p>
    </div>

    <div className="flex items-center gap-4">
      <FiTruck className="text-yellow-400 text-lg" />
      <p className="text-sm text-[#FFFFFFB2]">
        Free shipping above ₹1,999
      </p>
    </div>

    <div className="flex items-center gap-4">
      <FiTrendingUp className="text-yellow-400 text-lg" />
      <p className="text-sm text-[#FFFFFFB2]">
        Fair trade certified
      </p>
    </div>

    <div className="flex items-center gap-4">
      <FiMessageSquare className="text-yellow-400 text-lg" />
      <p className="text-sm text-[#FFFFFFB2]">
        Artisan stories with every purchase
      </p>
    </div>

  </div>
</div>
    </section>
  );
}

export default Hero;
