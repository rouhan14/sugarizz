// Updated Cart Page - Cart.js
"use client";

import { useEffect, useState } from "react";
import CartItem from "@/components/cartItem";
import useCookieStore from "@/store/cookieStore";
import data from "@/data";
import Link from "next/link";

export default function Cart() {
  const [hydrated, setHydrated] = useState(false);
  const quantities = useCookieStore((state) => state.quantities);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const cartItems = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([title, quantity]) => {
      const itemData = data.find((item) => item.title === title);
      return {
        ...itemData,
        quantity,
      };
    });

  return (
    <div
      className="flex flex-col items-center py-8 px-4 min-h-screen"
      style={{
        background: "linear-gradient(to right bottom, rgba(15,23,42,0.6), rgba(30,41,59,0.6))",
      }}
    >
      <h1 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-300">Your cart is empty.</p>
      ) : (
        cartItems.map((item, idx) => (
          <CartItem
            key={idx}
            title={item.title}
            description={item.description}
            image={item.image}
            quantity={item.quantity}
            bgColor={item.bgColor}
            price={item.price}
          />
        ))
      )}

      {cartItems.length > 0 && (
        <div
          className="mt-8 p-6 rounded-2xl w-full max-w-4xl text-white shadow-md"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2 font-medium">
            <span>Total Items:</span>
            <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between mb-2 font-medium">
            <span>Total Price:</span>
            <span>
              {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)} PKR
            </span>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <Link
          href="/checkout"
          className="w-full max-w-4xl py-3 rounded-md text-white font-semibold text-xl text-center
          bg-green-500/50 hover:bg-green-500/30
          border border-white/10
          shadow-[inset_0_0_4px_rgba(255,255,255,0.1),_0_4px_10px_rgba(0,128,0,0.2)]
          hover:shadow-[inset_0_0_6px_rgba(255,255,255,0.15),_0_6px_14px_rgba(0,128,0,0.3)]
          transition-all duration-300
          disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none
          cursor-pointer mt-6"
        >
          Checkout
        </Link>
      )}
    </div>
  );
}