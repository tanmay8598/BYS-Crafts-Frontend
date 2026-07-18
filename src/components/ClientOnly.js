"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "@/auth/context";
import Footer from "@/components/Footer/Footer";
import { Header } from "./Navbar/Header";
import AccountSidebar from './Cart/AccountSidebar';
import CartSidebar from './Cart/cartSidebar';


const ClientOnly = ({ children }) => {
  const [user, setUser] = useState();
    const [cartOpen, setCartOpen] = useState(false); 
      const [accountOpen, setAccountOpen] = useState(false);

 useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }

    // Expose global function to open cart
    window.openCartSidebar = () => {
      setCartOpen(true);
    };

    return () => {
      delete window.openCartSidebar;
    };
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
