"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import useCookieStore from "../store/cookieStore";

const MoveToCartPopup = () => {
  const { quantities } = useCookieStore();
  const [isMobile, setIsMobile] = useState(false);

  // Check if there are items in cart
  const hasItemsInCart = Object.values(quantities).some(qty => qty > 0);
  
  // Get total items count
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render if no items in cart
  if (!hasItemsInCart) return null;

  // Mobile version - clickable icon that navigates to cart
  if (isMobile) {
    return (
      <Link href="/cart" className="fixed bottom-6 right-6 z-[9999]">
        <div className="relative w-14 h-14 rounded-full bg-[#0FFF50] flex items-center justify-center text-black shadow-xl cursor-pointer hover:scale-105 transition-all duration-300">
          <FiShoppingCart size={24} />
          {/* Item count badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {totalItems}
          </div>
        </div>
      </Link>
    );
  }

  // Desktop version - hover functionality with clickable icon
  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <div className="group relative">
        {/* Main cart icon - clickable */}
        <Link href="/cart">
          <div className="relative w-16 h-16 rounded-full bg-[#0FFF50] flex items-center justify-center text-black shadow-xl cursor-pointer animate-bounce group-hover:animate-none group-hover:scale-110 transition-all duration-300">
            <FiShoppingCart size={28} />
            {/* Item count badge */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {totalItems}
            </div>
          </div>
        </Link>

        {/* Hover tooltip - text only */}
        <div className="absolute bottom-1 right-20 opacity-0 group-hover:opacity-100 translate-x-6 group-hover:translate-x-0 transition-all duration-300 ease-out pointer-events-none">
          <div className="bg-white text-black px-6 py-3 rounded-2xl shadow-2xl border-2 border-[#0FFF50] min-w-max">
            <div className="flex flex-col text-center">
              <span className="text-sm font-bold text-black">
                {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
              </span>
              <span className="text-xs text-gray-600">Click to checkout!</span>
            </div>
          </div>
          {/* Arrow pointing to the icon */}
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-[#0FFF50] border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default MoveToCartPopup;