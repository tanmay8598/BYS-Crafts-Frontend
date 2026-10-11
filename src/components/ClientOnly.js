

"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import AuthContext from "@/auth/context";
import apiClient from "@/api/client";
import Footer from "@/components/Footer/Footer";
import { Header } from "./Navbar/Header";
import AccountSidebar from "./Cart/AccountSidebar";
import CartSidebar from "./Cart/CartSidebar";
import { clearAuthCookie, setAuthCookie } from "@/auth/authCookie";
import { setAccessToken, clearAccessToken } from "@/auth/accessToken";

const ClientOnly = ({ children }) => {
  const [user, setUser] = useState();
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // 1) Restore session on app load.
  // The refresh token lives in an httpOnly cookie and is sent automatically
  // by the browser (withCredentials: true in apiClient). On success we get a
  // fresh access token, keep it in memory, and set the middleware gate cookie.
  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      try {
        const res = await apiClient.post("/user/refresh-tokens");
   

        if (res.ok && res.data?.accessToken) {
          const newToken = res.data.accessToken;

          setAccessToken(newToken); // in-memory store (header transport)
          setAuthCookie(newToken); // non-httpOnly cookie for middleware gate
          setUser(jwtDecode(newToken));
        } else {
          clearAccessToken();
          clearAuthCookie();
          setUser(null);
        }
      } catch {
        // No valid refresh cookie → user is simply logged out.
        // Don't show an error; this is the normal state for a guest.
        clearAccessToken();
        clearAuthCookie();
        setUser(null);
      }
    })();
  }, []);

  // 2) Expose global helpers (cart, account sidebars)
  useEffect(() => {
    window.openCartSidebar = () => setCartOpen(true);
    window.closeCartSidebar = () => setCartOpen(false);

    window.openAccountSidebar = () => setAccountOpen(true);
    window.closeAccountSidebar = () => setAccountOpen(false);

    return () => {
      delete window.openCartSidebar;
      delete window.closeCartSidebar;
      delete window.openAccountSidebar;
      delete window.closeAccountSidebar;
    };
  }, []);

  // 3) Listen for global auth failures from anywhere in the app
  useEffect(() => {
    const handleAuthFailed = () => {
      setUser(null);
      clearAccessToken();
      clearAuthCookie();
      setCartOpen(false);
      setAccountOpen(false);

      toast.error("Your session has expired. Please log in again.", {
        id: "session-expired",
      });
    };

    window.addEventListener("authFailed", handleAuthFailed);
    return () => window.removeEventListener("authFailed", handleAuthFailed);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Header setCartOpen={setCartOpen} />
      <main className="relative ">{children}</main>
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenAccount={() => setAccountOpen(true)}
      />
      <AccountSidebar isOpen={accountOpen} setIsOpen={setAccountOpen} />
      <Footer />
    </AuthContext.Provider>
  );
};

export default ClientOnly;