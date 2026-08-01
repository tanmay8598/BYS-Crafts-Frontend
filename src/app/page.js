import { Suspense } from "react";
import dynamic from "next/dynamic";

// Static components (no data fetching)
import ShopByCategory from "@/components/Home/ShopByCategory";
import WhatClient from "@/components/whatClientSays/WhatClient";
import BrowseByDistricts from "@/components/ShopbyCategory/BrowseByCategory";


// Dynamic imports for client components that need hooks
const Hero = dynamic(() => import("@/components/Hero/Hero"));
const BestSellingCraftHome = dynamic(
  () => import("@/components/BestSellers/BestSellingCraftHome"),
);
const NewArrivals = dynamic(
  () => import("@/components/NewArrivals/NewArrivals"),
);
const BlogHero = dynamic(() => import("@/components/Blog/BlogHero"));

const SERVER = process.env.NEXT_PUBLIC_SERVER;
const REVALIDATE = { next: { revalidate: 300 } };

// ----- FETCH FUNCTIONS -----
async function getCategories() {
  const res = await fetch(`${SERVER}/variation/category/get`, REVALIDATE);
  const data = await res.json();
  return data.categories || [];
}

async function getMostOrderedProducts() {
  const res = await fetch(
    `${SERVER}/product/most-ordered-products`,
    REVALIDATE,
  );
  const data = await res.json();
  return data.mostOrderedProducts || [];
}

async function getNewArrivals() {
  const res = await fetch(`${SERVER}/product/get-new-arrival`, REVALIDATE);
  const data = await res.json();
  return data.products || [];
}

async function getTestimonials() {
  try {
    const res = await fetch(
      `${SERVER}/testimonial/get-active-testimonials`,
      REVALIDATE,
    );
    if (!res.ok) {
      throw new Error("Failed to fetch testimonials");
    }
    const data = await res.json();
    return data.testimonials || [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return []; // Return empty array to use fallback data
  }
}

async function getDistricts() {
  try {
    const res = await fetch(`${SERVER}/district/get-all-districts`, REVALIDATE);
    if (!res.ok) {
      throw new Error("Failed to fetch districts");
    }
    const data = await res.json();
    return data.districts || [];
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
}

// async function getBlogs() {
//   const res = await fetch(`${SERVER}/blog`, REVALIDATE);
//   const data = await res.json();
//   return data.blogs || [];
// }

// ----- SECTION COMPONENTS (Server Components that fetch data) -----
async function CategoriesSection() {
  const categories = await getCategories();
  return <ShopByCategory categories={categories} />;
}

async function BestSellingSection() {
  const products = await getMostOrderedProducts();
  return <BestSellingCraftHome products={products} />;
}

async function NewArrivalsSection() {
  const products = await getNewArrivals();
  return <NewArrivals products={products} />;
}

async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  return <WhatClient testimonials={testimonials} />;
}

async function DistrictsSection() {
  const districts = await getDistricts();
  return <BrowseByDistricts districts={districts} />;
}

// async function BlogSection() {
//   const blogs = await getBlogs();
//   return <BlogHero blogs={blogs} />;
// }

// ----- MAIN PAGE -----
export default function Home() {
  return (
    <div className="bg-white">
      <div className="relative">
        {/* Hero is static/no data - render directly */}
        <Hero />

        <Suspense
          fallback={
            <div className="h-64 bg-gray-100 animate-pulse rounded-lg mx-4 my-8" />
          }
        >
          <CategoriesSection />
        </Suspense>

        <Suspense
          fallback={
            <div className="h-96 bg-gray-100 animate-pulse rounded-lg mx-4 my-8" />
          }
        >
          <BestSellingSection />
        </Suspense>
      </div>

      {/* WhatClient is static data - render directly */}

      <Suspense
        fallback={
          <div className="h-96 bg-gray-800 animate-pulse rounded-lg mx-4 my-8" />
        }
      >
        <TestimonialsSection />
      </Suspense>


      <Suspense
        fallback={
          <div className="h-96 bg-gray-100 animate-pulse rounded-lg mx-4 my-8" />
        }
      >
        <NewArrivalsSection />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-80 bg-gray-100 animate-pulse rounded-lg mx-4 my-8" />
        }
      >
        <DistrictsSection />
      </Suspense>

      {/* <Suspense fallback={<div className="h-80 bg-gray-100 animate-pulse rounded-lg mx-4 my-8" />}>
        <BlogSection />
      </Suspense> */}
    </div>
  );
}
