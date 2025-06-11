"use client";

import React from "react";

const Checkout = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <form className="space-y-6">
        {/* Customer Info */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name<span className="text-red-500">*</span></label>
            <input type="text" required className="w-full border border-gray-300 p-2 rounded-md" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email<span className="text-red-500">*</span></label>
            <input type="email" required className="w-full border border-gray-300 p-2 rounded-md" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number<span className="text-red-500">*</span></label>
            <input type="tel" required className="w-full border border-gray-300 p-2 rounded-md" />
          </div>
        </div>

        {/* Payment */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="cod" checked readOnly />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address<span className="text-red-500">*</span></label>
          <input type="text" required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block mb-1 font-medium">Additional Recommendations (optional)</label>
          <textarea rows="3" className="w-full border border-gray-300 p-2 rounded-md" />
        </div>

        {/* Optional Location Link */}
        <div>
          <label className="block mb-1 font-medium">Delivery Location Link (optional)</label>
          <input type="url" className="w-full border border-gray-300 p-2 rounded-md" placeholder="Paste Google Maps link here" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
