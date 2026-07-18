

"use client";
import useAuth from "@/auth/useAuth";
import AddressPage from "@/components/Account/AddressPage";
import MyProfile from "@/components/Account/MyProfile";
import OrderPage from "@/components/Account/OrderPage";
import { useState } from "react";
import {useRouter} from 'next/navigation'
import toast from "react-hot-toast";

import AccountSettings from "@/components/Settings/AccountSettings";
import {
  FiGrid,
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiSettings,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import WishlistSection from './../../components/Account/WishlistSection';

const Page = () => {
  const { user, logOut } = useAuth();
 const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard");
  
  
    const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: FiGrid },
    { key: "orders", label: "My orders", icon: FiShoppingBag },
    { key: "wishlist", label: "Wishlist", icon: FiHeart },
    { key: "address", label: "Addresses", icon: FiMapPin },
    { key: "profile", label: "Personal info", icon: FiUser },
  
  ];

  const handleLogout = () => {
    logOut()
    toast.success("Logout success")
    router.push("/")
  }


  return (
    <div className="w-full bg-[#FAF6ED] min-h-screen px-4 md:px-10 py-6">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-6">

        <div className="w-full md:w-[260px] bg-[#FAF6ED] rounded-2xl p-5 border border-[#1B3A5C0F]">

          <div className="flex flex-col items-center border-b border-[#e6dfd5] pb-5">
            <div className="w-16 h-16 rounded-full bg-[#1f3b57] text-white flex items-center justify-center text-xl font-semibold">
              {user?.name?.charAt(0)}
            </div>

            <h2 className="mt-3 font-semibold text-[#2c2c2c]">
              {user?.name}
            </h2>

            <p className="text-xs text-gray-500">{user?.email}</p>

           
          </div>

      <div className="mt-6 space-y-1 text-sm">

  {menuItems.map((item) => {
    const Icon = item.icon;

    return (
      <div
        key={item.key}
        onClick={() => setActiveTab(item.key)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
          activeTab === item.key
            ? "bg-[#dfe7f2] text-[#1f3b57] font-medium"
            : "text-gray-600 hover:bg-[#eee7dd]"
        }`}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </div>
    );
  })}

  <div className="my-4 border-t border-[#e6dfd5]" />

  <div
    onClick={() => handleLogout()}
    className="flex items-center gap-3 px-4 py-3 text-red-500 rounded-xl cursor-pointer hover:bg-red-50"
  >
    <FiLogOut size={18} />
    <span>Log out</span>
  </div>
</div>
        </div>

        <div className="flex-1">

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total orders" value="12" />
                <StatCard title="Wishlist items" value="5" />
                <StatCard title="Total spent" value="₹28.4K" green />
                <StatCard title="Total saved" value="₹4.2K" red />
              </div>

              <OrderPage />
            </>
          )}

          {activeTab === "orders" && <OrderPage />}
          {activeTab === "wishlist" && <WishlistSection />}
          {activeTab === "address" && <AddressPage />}
          {activeTab === "profile" && <MyProfile />}
        
        </div>
      </div>
    </div>
  );
};

export default Page;

const StatCard = ({ title, value, green, red }) => (
  <div className="bg-[#FAF6ED] border border-[#1B3A5C0F] p-4 rounded-xl">
    <div className="text-xs text-gray-500">{title}</div>
    <div
      className={`text-lg font-semibold mt-1 ${
        green ? "text-green-600" : red ? "text-red-500" : "text-[#1f3b57]"
      }`}
    >
      {value}
    </div>
  </div>
);

