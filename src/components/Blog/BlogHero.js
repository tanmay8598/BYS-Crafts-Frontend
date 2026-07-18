"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import BlogCard from "./BlogCard";

const BlogHero = ({blogs}) => {

  return (
    <section className="py-16 bg-[#faf6ed]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest text-[#C8A96A] uppercase mb-2">
              From our blog
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
              Stories & Insights
            </h2>
          </div>

          <Link
            href="/blogs"
            className="flex items-center gap-2 border border-gray-400 px-4 py-2 rounded-lg text-sm hover:bg-black hover:text-white transition"
          >
            View all blogs
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
          {blogs?.slice(0, 3).map((blogData) => (
            <BlogCard key={blogData._id} blogData={blogData} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
