"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "@/auth/context";
import Footer from "@/components/Footer/Footer";
import { Header } from "./Navbar/Header";
import AccountSidebar from './Cart/AccountSidebar';
import CartSidebar from './Cart/CartSidebar';
import { clearAuthCookie, setAuthCookie } from "@/auth/authCookie";


const ClientOnly = ({ children }) => {
  const [user, setUser] = useState();
    const [cartOpen, setCartOpen] = useState(false); 
      const [accountOpen, setAccountOpen] = useState(false);

//  useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         setUser(jwtDecode(token));
//       } catch (error) {
//         console.error("Invalid token:", error);
//         localStorage.removeItem("token");
//       }
//     }

//     // Expose global function to open cart
//     window.openCartSidebar = () => {
//       setCartOpen(true);
//     };

//     return () => {
//       delete window.openCartSidebar;
//     };
//   }, []);

// 1) Restore session: decode token, sync cookie, refresh if expired
useEffect(() => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  if (!token) return;

  const restoreSession = async () => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      // Token still valid → set user + sync cookie
      if (!decoded.exp || decoded.exp > now) {
        setUser(decoded);
        setAuthCookie(token);
        return;
      }

      // Token expired → try refresh
      const res = await apiClient.post("/user/refresh-tokens");
      if (res.ok && res.data?.accessToken) {
        const newToken = res.data.accessToken;
        localStorage.setItem("token", newToken);
        setAuthCookie(newToken);
        setUser(jwtDecode(newToken));
      } else {
        localStorage.removeItem("token");
        clearAuthCookie();
        setUser(null);
      }
    } catch (err) {
      console.error("Session restore failed:", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  restoreSession();
}, []);

// 2) Expose global helpers (cart, login, verification)
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
    localStorage.removeItem("token");
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
      <Header   setCartOpen={setCartOpen}/>
      <main className="relative ">{children}</main>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} onOpenAccount={() => setAccountOpen(true)}  />
      <AccountSidebar isOpen={accountOpen} setIsOpen={setAccountOpen} /> 
      <Footer />
    </AuthContext.Provider>
  );
};

export default ClientOnly;
