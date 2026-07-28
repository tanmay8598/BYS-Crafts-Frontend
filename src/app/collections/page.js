

"use client";
import apiClient from "@/api/client";
import BlogBanner from "@/components/Blog/BlogBanner";
import Link from "next/link";
import { Card } from "@/components/ui/lovable/card";
import Loader from "@/components/loader/Loader";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("first", apiClient)

  const CategoryCard = ({ category, index }) => {
  const { name, image } = category;
  const colors = [
    "bg-[#2F4E6F] text-white",
    "bg-[#E5DCCB] text-[#2F3E46]",
    "bg-[#D4AF37] text-[#1E1E1E]",
    "bg-[#E06A4E] text-white",
  ];

  const bgColor = colors[index % colors.length];

  return (
    <Link href={`/collections/${category._id}`}>
      <Card
        className={`relative rounded-xl p-6 flex flex-col justify-between 
        h-56 sm:h-64 md:h-72 w-full
        shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${bgColor}`}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-5 h-5 border rounded-sm border-current"></div>
          )}
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold capitalize">
            {category.name}
          </h3>
          <p className="text-sm opacity-80 mt-1">
            {category.productCount || category.products?.length || 0} products
          </p>
        </div>
      </Card>
    </Link>
  );
};

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/variation/category/get");
        // Fix: Check if response is successful
        if (response.status === 200 || response.ok) {
          const data = response.data.categories;
          setCategories(data);
        } else {
          console.error("Failed to fetch categories:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="pt-5 max-w-screen-xl bg-bg-light mx-auto p-5 sm:p-10 md:pb-16 md:pr-16 md:pl-16 md:pt-1">
        <BlogBanner
          title="SHOP BY COLLECTIONS"
          // subtitle="Insights and news shaping the future of travel."
        />
        {loading ? (
          <div>
            <Loader />
          </div>
        ) : (
          <div  className="
          grid 
          grid-cols-2 
          lg:grid-cols-4 
          gap-4 lg:gap-8 
          mt-6
          items-stretch   
        ">
            {/* Fix: Map over categories and render ShopCategoryCard for each */}
            {categories.map((category, index) => (
              <CategoryCard 
                key={category._id || index} 
                category={category} 
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Page;