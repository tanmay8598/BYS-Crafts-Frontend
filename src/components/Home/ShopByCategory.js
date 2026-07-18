"use client";
import { Button } from "@/components/ui/lovable/button";
import { Card } from "@/components/ui/lovable/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/lovable/carousel";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        h-64  md:h-80 w-full
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

const ShopByCategory = ({ categories }) => {


  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);


  useEffect(() => {

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#faf6ed]">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs tracking-[0.2em] text-[#C4A96A] mb-3 uppercase">
          Shop by craft
        </p>

        <h2 className="text-center text-2xl sm:text-4xl font-serif font-semibold text-[#2F3E46]">
          Explore our collections
        </h2>

        <p className="text-center text-sm text-gray-500 mt-3 mb-10 max-w-xl mx-auto">
          Each region of India brings a unique craft tradition passed down
          through generations
        </p>

        {isMobile ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {(showAll ? categories : categories.slice(0, 4)).map(
                (category, index) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    index={index}
                  />
                ),
              )}
            </div>

            {categories.length > 4 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full flex items-center gap-2"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show More
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="relative">
            <Carousel opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {categories.map((category, index) => (
                  <CarouselItem
                    key={category._id}
                    className="basis-1/2 md:basis-1/3 lg:basis-1/4 p-3"
                  >
                    <CategoryCard category={category} index={index} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="-left-6 bg-white shadow-md" />
              <CarouselNext className="-right-6 bg-white shadow-md" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;
