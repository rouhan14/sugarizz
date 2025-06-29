"use client";

import { useEffect, useState } from "react";
import CartItem from "@/components/cartItem";
import useCookieStore from "@/store/cookieStore";
import data from "@/data";
import Link from "next/link";

const DELIVERY_CHARGES = 300

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
    <div className="flex flex-col items-center py-8 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
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

      {/* Writing the total price for the order */}
      {cartItems.length > 0 && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Total Items:</span>
            <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Charges:</span>
            <span>{DELIVERY_CHARGES}</span>
          </div>
          <div className="flex justify-between mb-2">            
            <span>Total Price:</span>
            <span>
              {DELIVERY_CHARGES + cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            </span>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <Link href="/checkout" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors cursor-pointer">
          Checkout
        </Link>
      )}

    </div>
  );
}