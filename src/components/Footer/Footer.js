"use client";

import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#0F1E2F] text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              BYS CRAFTS
            </h3>

        

            <p className="text-sm text-[#FFFFFF99] mt-4 leading-relaxed max-w-xs">
              Connecting India's finest artisans with conscious customers
              worldwide. Every craft has a story. Every purchase has an impact.
            </p>

            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[#FFFFFF1F] transition cursor-pointer"
                >
                  <Icon color="#FFFFFF80" size={16} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Shop</h4>
          <ul className="space-y-4 text-sm text-[#FFFFFF80]">
  <li>
    <Link href="/collections" className="block hover:text-white transition cursor-pointer">
      Collections
    </Link>
  </li>

  <li>
    <Link href="/new-arrivals" className="block hover:text-white transition cursor-pointer">
      New Arrivals
    </Link>
  </li>

  <li>
    <Link href="/blogs" className="block hover:text-white transition cursor-pointer">
      Blogs
    </Link>
  </li>

  <li>
    <Link href="/about-us" className="block hover:text-white transition cursor-pointer">
      About Us
    </Link>
  </li>
</ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-[#FFFFFF80]">
              <li className="hover:text-white cursor-pointer">Our story</li>
              <li className="hover:text-white cursor-pointer">
                Artisan partners
              </li>
              <li className="hover:text-white cursor-pointer">Impact report</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
            
            </ul>
          </div>

         <div>
  <h4 className="text-sm font-semibold mb-4 text-white">Support</h4>
  <ul className="space-y-4 text-sm text-[#FFFFFF80]">
    <li>
      <Link href="/contact-us" className="block hover:text-white transition cursor-pointer">
        Contact us
      </Link>
    </li>
   
    <li>
      <Link href="/privacy-policy" className="block hover:text-white transition cursor-pointer">
        Privacy Policy
      </Link>
    </li>
    <li>
      <Link href="/terms-conditions" className="block hover:text-white transition cursor-pointer">
        Terms & Conditions
      </Link>
    </li>
    <li>
      <Link href="/return-cancellations" className="block hover:text-white transition cursor-pointer">
        Returns & exchange
      </Link>
    </li>
 
  </ul>
</div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#FFFFFF99] text-center md:text-left">
            © {new Date().getFullYear()} BYS Crafts. Crafted with care in India.
          </p>

          <div className="flex gap-2 flex-wrap justify-center">
            {["UPI", "Visa", "Mastercard", "RuPay", "COD"].map((item, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 border border-white/20 rounded-md text-[#FFFFFF80]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
