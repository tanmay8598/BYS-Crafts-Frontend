"use client";
import React, { useEffect, useState } from "react";
import apiClient from "@/api/client";
import Loader from "../loader/Loader";
import Pagination from "@/components/ShopbyCategory/Pagination";
import BlogCard from "./BlogCard";
import Link from "next/link";

const BlogsDetails = () => {
  const [blogList, setBlogList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllBlog();
  }, [currentPage]);

  const getAllBlog = async () => {
    try {
      const response = await apiClient.get("/blog/get-all-blogs", {
        pageNumber: currentPage,
      });

      if (response.ok) {
        setBlogList(response.data);
        setPageSize(response.data.pageCount);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const allblogs = blogList.blogs || [];
  const featuredBlog = allblogs[0];
  const remainingBlogs = allblogs.slice(1);



  if (isLoading) return <Loader />;

  return (
    <div className="bg-[#FAF6ED] max-w-screen-xl mx-auto px-5 md:px-10 py-10">

    
      <div className="text-center mb-12">
        <p className="text-xs tracking-widest text-text-yellowText uppercase mb-2">
          The BYS Journal
        </p>

        <h1 className="text-3xl md:text-5xl font-bold text-text-primaryText mb-4">
          Stories of craft & culture
        </h1>

        <p className="text-text-secondaryText max-w-2xl mx-auto text-sm md:text-base">
          Dive into the world behind every handmade piece — artisan stories,
          craft traditions, styling guides, and more.
        </p>
      </div>

      {featuredBlog && (
        <div className="grid md:grid-cols-2 gap-8 mb-14 items-center">

          <Link href={`/blogs/${featuredBlog._id}`}>
            <div className="relative h-[280px] md:h-[350px] rounded-2xl overflow-hidden bg-[#1B3A5C]">
              <img
                src={featuredBlog.image?.[0]}
                alt={featuredBlog.heading}
                className="w-full h-full object-cover"
              />

              <span className="absolute top-4 text-[#0F1E2F] left-4 bg-[#E8C547] text-xs px-3 py-1 rounded-lg font-medium">
                Featured
              </span>
            </div>
          </Link>

          <div>
            <p className="text-xs tracking-widest text-text-yellowText uppercase mb-2">
              Artisan Story
            </p>

            <Link href={`/blogs/${featuredBlog._id}`}>
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-3 leading-snug hover:underline">
                {featuredBlog.heading}
              </h2>
            </Link>

            <p className="text-text-secondaryText text-sm mb-4 line-clamp-3">
              {featuredBlog.mdesc || "No description available"}
            </p>

            <div className="text-xs text-text-secondary flex items-center gap-3">
              <span>
                {new Date(featuredBlog.createdAt).toDateString()}
              </span>
              <span>•</span>
              <span>{getReadTime(featuredBlog.content)} min read</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {remainingBlogs.map((blog) => (
          <BlogCard key={blog._id} blogData={blog} />
        ))}
      </div>

      <div className="mt-10">
        <Pagination
          count={pageSize}
          page={currentPage}
          siblingCount={1}
          onChange={(e, value) => setCurrentPage(value)}
        />
      </div>
    </div>
  );
};

const getReadTime = (content = "") => {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
};

export default BlogsDetails;