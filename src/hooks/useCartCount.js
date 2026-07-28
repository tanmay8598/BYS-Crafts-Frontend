import { useEffect, useState } from "react";
import { useCartStore } from "./../stores/cartStore";
import useAuth from "./../auth/useAuth";
import apiClient from "./../api/client";
export const useCartCount = () => {
  const { user } = useAuth();
  const { cart: localCart } = useCartStore();
  const [backendCount, setBackendCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBackendCart = async () => {
    if (!user) {
      setBackendCount(0);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get("/cart/get", {
        userId: user?.id,
      });

      let count = 0;
      if (Array.isArray(response.data.cart)) {
        count = response.data.cart.length;
      } else if (Array.isArray(response.data?.items)) {
        count = response.data.items.length;
      }
      setBackendCount(count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setBackendCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchBackendCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [user]);

  // Calculate total count
  // const totalCount = user
  //   ? backendCount
  //   : localCart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const totalCount = user ? backendCount : localCart.length;

  return { count: totalCount, loading };
};
