"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { Search, Heart, User, Menu, X, ShoppingCart, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShare2, FiUsers, FiMapPin } from "react-icons/fi";

import useAuth from "@/auth/useAuth";
import AccountSidebar from "../Cart/AccountSidebar";
import SearchSidebar from "../Search/SearchSidebar";
import CartSidebar from './../Cart/cartSidebar';

export const Header = ({ setCartOpen }) => {
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [cartLength, setCartLength] = useState(0);

  const selector = useSelector((state) => state.cart);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setCartLength(selector.cart.length);
  }, [selector.cart]);

  const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: "BYS Crafts",
        text: "Check out this amazing site!",
        url: window.location.origin, // better than href for homepage
      });
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      alert("Link copied!");
    }
  } catch (err) {
    console.log("Share failed:", err);
  }
};

  return (
    <>
      <div className="bg-bg-darkBlue text-white text-xs text-center font-secondary  py-2 tracking-wide">
        Free shipping on orders above{" "}
        <span className="text-[#C8A96A] font-semibold">₹1,999</span> | Use code{" "}
        <span className="text-[#C8A96A] font-semibold">ARTISAN15</span> for 15%
        off
      </div>

      <nav className="sticky top-0 z-50 bg-bg-light border-b-2 border-[#1B3A5C14]">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Link href="/" className="flex items-center">
                <img src="/BYDLogo.webp" className="h-10" />
              </Link>
            </div>

            <div className="hidden lg:flex flex-1 justify-center">
              <div className="flex items-center gap-10 text-[14px] font-medium font-secondary  text-[#3A4A5C] whitespace-nowrap">
                <Link
                  href="/collections"
                  className="hover:opacity-70 transition"
                >
                  Collections
                </Link>
              
                <Link
                  href="/new-arrivals"
                  className="hover:opacity-70 transition"
                >
                  New arrivals
                </Link>
                <Link href="/blogs" className="hover:opacity-70 transition">
                  Blogs
                </Link>
                <Link href="/about-us" className="hover:opacity-70 transition">
                  About Us
                </Link>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-end gap-6 text-[#1E2A38]">
              <button onClick={() => setIsSearchOpen(true)}>
                <Search size={20} />
              </button>


              <button  onClick={() => setCartOpen(true)}   className="relative">
                <ShoppingCart size={20} />
                {cartLength > 0 && (
                  <span className="absolute -top-3 -right-3 bg-[#E8C547] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {cartLength}
                  </span>
                )}
              </button>

              <button
                onClick={() =>
                  user ? router.push("/account") : setIsAccountOpen(true)
                }
              >
                <User size={20} />
              </button>

              <button
                className="lg:hidden"
                onClick={() => setIsMobileMenu(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>


   <AnimatePresence>
  {isMobileMenu && (
    <>
      <motion.div
        className="fixed inset-0  bg-black/30 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsMobileMenu(false)}
      />

      <motion.div
        className="fixed top-0 right-0 h-full lg:hidden w-full max-w-lg bg-bg-dark z-50 flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h1 className="text-[13px] tracking-[0.2em] font-semibold text-[#1E2A38]">
            BYS CRAFTS
          </h1>

          <X
            size={22}
            className="cursor-pointer text-[#1E2A38]"
            onClick={() => setIsMobileMenu(false)}
          />
        </div>

        <div className="flex flex-col px-6 mt-2">
          {[
            { label: "Collections", href: "/collections" },
            { label: "New Arrivals", href: "/new-arrivals" },
            { label: "Blogs", href: "/blogs" },
            { label: "About Us", href: "/about-us" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setIsMobileMenu(false)}
              className="flex items-center justify-between py-5 border-b border-[#D6D0C8] text-[16px] text-[#1E2A38]"
            >
              <span className="font-medium">{item.label}</span>
              <ChevronRight size={16} className="opacity-70" />
            </Link>
          ))}
        </div>

        <div className="mt-auto px-6 pb-8">
          <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-2">
            Need Help?
          </p>

          <p className="text-[14px] text-[#1E2A38] mb-6">
            support@bycrafts.com
          </p>

       <div className="flex items-center gap-6 text-[#1E2A38] text-lg">
  <button onClick={handleShare}>
    <FiShare2 />
  </button>

  <button onClick={() => router.push("/account")}>
    <FiUsers />
  </button>

  <button onClick={() => window.open("https://maps.google.com", "_blank")}>
    <FiMapPin />
  </button>
</div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

      <CartSidebar isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
      <AccountSidebar isOpen={isAccountOpen} setIsOpen={setIsAccountOpen} />
      <SearchSidebar isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </>
  );
};
