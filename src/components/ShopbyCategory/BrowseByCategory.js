"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import apiClient from "@/api/client";
import { MapPin, ChevronRight, Compass } from "lucide-react";

const BrowseByDistricts = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await apiClient.get("/district/get-all-districts");
      if (response.ok) {
        setDistricts(response.data.districts);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[190px] lg:h-[280px] bg-gray-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 lg:py-10 bg-[#faf6ed]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Shop by{" "}
            <span className="relative">
              <span className="relative z-10 text-amber-600">Districts</span>
              <svg
                className="absolute bottom-0 left-0 w-full h-3 -z-0"
                viewBox="0 0 100 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 5C20 0 40 10 60 5C80 0 95 8 100 5"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                />
              </svg>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Discover unique craftsmanship from different districts of
            Bundelkhand, each with its own cultural heritage and artistic
            traditions.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {districts?.slice(0, 7).map((district) => (
            <Link
              key={district._id || district.name}
              href={`/district/${district.name}`}
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative h-[190px] lg:h-[280px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${district.image})` }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold text-lg">
                      {district.name}
                    </span>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                    <ChevronRight className="w-4 h-4 text-gray-800" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}

          {/* Last Card - "View All" */}
          {/* <Link href="/districts" className="group">
            <div className="relative h-[190px] lg:h-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-200 hover:border-amber-400 transition-colors flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🏛️</div>
                <h3 className="font-semibold text-gray-800">View All</h3>
                <p className="text-sm text-gray-500 mt-1">Discover more districts</p>
                <ChevronRight className="w-5 h-5 mx-auto mt-2 text-amber-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link> */}
        </div>
      </div>
    </section>
  );
};

export default BrowseByDistricts;
