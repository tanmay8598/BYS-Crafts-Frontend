"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/ShopbyCategory/Pagination";
import apiClient from "@/api/client";
import Loader from "@/components/loader/Loader";
import BestSellingCraftCard from './../../components/BestSellers/BestSellingCraftCard';

const BestSellersClient = () => {
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState();

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/product/most-ordered-products", {
        pageNumber: currentPage,
      });

      if (response.ok) {
        setProducts(response.data.mostOrderedProducts);
        setPageSize(response.data.pageCount);
      } else {
        setError(response.statusText);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-3 sm:px-6 lg:px-8 pb-16 pt-6">
      {/* Loader */}
      {isLoading && (
        <div className="flex justify-center items-center h-60">
          <Loader />
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-4 text-center">
          {error}
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
        <div className="w-full">
          {products.length === 0 ? (
            <p className="text-center text-lg text-gray-500 py-12">
              No products found
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-3">
              {products.map((product) => (
                <div key={product._id} className="w-full">
                  <BestSellingCraftCard
                    product={product.productDetails || product}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pageSize > 1 && (
        <div className="mt-10 w-full">
          <Pagination
            count={pageSize}
            page={currentPage}
            siblingCount={1}
            onChange={(e, value) => setCurrentPage(value)}
          />
        </div>
      )}
    </div>
  );
};

export default BestSellersClient;
