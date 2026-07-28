// stores/cartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      // Add product with proper structure matching your backend
      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const exists = cart.find((item) => item.product._id === product._id);

        if (exists) {
          const updated = cart.map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  product: product,
                }
              : item
          );
          set({ cart: updated });
        } else {
          set({
            cart: [
              ...cart,
              {
                _id: `local_${Date.now()}`, // Temporary ID for local items
                product: product,
                quantity: quantity,
                isLocal: true, // Flag to identify local items
              },
            ],
          });
        }
      },

      removeFromCart: (id) =>
        set({
          cart: get().cart.filter((item) => item._id !== id),
        }),

      clearCart: () => set({ cart: [] }),

      increaseQty: (id) =>
        set({
          cart: get().cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }),

      decreaseQty: (id) =>
        set({
          cart: get()
            .cart.map((item) =>
              item._id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        }),

      cartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + (item.product?.price || 0) * item.quantity,
          0
        );
      },

      // Sync local cart to backend when user logs in
      // syncCartToBackend: async (userId, apiClient) => {
      //   // console.log("from zustand", userId, apiClient);
      //   const localCart = get().cart.filter((item) => item.isLocal);
      //   if (localCart.length === 0) return;

      //   try {
      //     // Add each local item to backend
      //     for (const item of localCart) {
      //       await apiClient.post("/cart/add", {
      //         userId: userId,
      //         item: {
      //           product: item.product._id,
      //           qty: item.quantity,
      //         },
      //         type: "increment",
      //       });
      //     }

      //     // Clear local cart after successful sync
      //     set({
      //       cart: get().cart.filter((item) => !item.isLocal),
      //     });

      //     return true;
      //   } catch (error) {
      //     console.error("Failed to sync cart to backend:", error);
      //     return false;
      //   }
      // },


      syncCartToBackend: async (userId, apiClient) => {
  const localCart = get().cart.filter((item) => item.isLocal);
  if (localCart.length === 0) {
    // console.log("No local items to sync");
    return true;
  }

  try {
    const response = await apiClient.get("/cart/get", {
      userId: userId,
    });

    // console.log("store se res", response)

    let backendItems = [];
    if (response.data && Array.isArray(response.data?.cart)) {
      backendItems = response.data.cart;
    } else if (response.data && Array.isArray(response.data)) {
      backendItems = response.data;
    } else if (response.data && response.data.cart) {
      backendItems = response.data.cart || [];
    }

    const backendMap = new Map();
    backendItems.forEach(item => {
      const product = item.product || item;
      const productId = product._id || product.id;
      backendMap.set(productId, item.quantity || 1);
    });

    let syncSuccessful = true;

    // console.log("local wala cart", localCart)

    for (const localItem of localCart) {
      const productId = localItem.product._id;
      const localQty = localItem.quantity || 1;
      const backendQty = backendMap.get(productId) || 0;

      if (backendQty > 0) {
        // Item exists in backend
        if (localQty > backendQty) {
          // Local has MORE - add the difference
          const diff = localQty - backendQty;
          try {
            const updateResponse = await apiClient.post("/cart/add", {
              userId: userId,
              item: {
                product: productId,
                qty: diff,
              },
              type: "increment",
            });
            if (!updateResponse.ok) syncSuccessful = false;
          } catch (error) {
            console.error("Error updating item:", error);
            syncSuccessful = false;
          }
        } else if (localQty < backendQty) {
          // Local has LESS - we want to keep the backend quantity
          // Do nothing - keep the larger backend quantity
          console.log(`Item ${productId} has backend quantity ${backendQty} > local ${localQty}, keeping backend`);
        } else {
          // Equal quantities - do nothing
          console.log(`Item ${productId} already has quantity ${backendQty}`);
        }
      } else {
        // New item - add it
        try {
          const addResponse = await apiClient.post("/cart/add", {
            userId: userId,
            item: {
              product: productId,
              qty: localQty,
            },
            type: "increment",
          });
          if (!addResponse.ok) syncSuccessful = false;
        } catch (error) {
          console.error("Error adding item:", error);
          syncSuccessful = false;
        }
      }
    }

    set({
      cart: get().cart.filter((item) => !item.isLocal),
    });
    console.log("Local cart cleared after sync");

    return syncSuccessful;
  } catch (error) {
    console.error("Failed to sync cart to backend:", error);
    set({
      cart: get().cart.filter((item) => !item.isLocal),
    });
    return false;
  }
},

        getTotalQuantity: () => {
        const state = get();
        return state.cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
      },
      

      // Merge backend cart with local cart
      mergeCarts: (backendCart) => {
        const localCart = get().cart;

        // Create a map for easy lookup
        const backendMap = new Map();
        backendCart.forEach((item) => {
          backendMap.set(item.product._id, item);
        });

        // Filter out local items that already exist in backend
        const uniqueLocalItems = localCart.filter(
          (localItem) => !backendMap.has(localItem.product._id)
        );

        // Combine backend items with unique local items
        const mergedCart = [...backendCart, ...uniqueLocalItems];

        set({ cart: mergedCart });
      },
    }),
    {
      name: "byscrafts-cart",
    }
  )
);
