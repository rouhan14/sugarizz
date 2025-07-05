"use client";

import React from "react";

export default function CustomerInfo({ isOrderingTime }) {
  return (
    <div
      className="space-y-4 w-full rounded-2xl p-6 backdrop-blur-md bg-white/10 
                 border border-white/20 shadow-2xl transition-all duration-300"
    >
      <h2 className="text-xl font-semibold text-white border-b pb-2">
        Customer Information
      </h2>

      <div>
        <label className="block mb-1 font-medium text-white/90">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          disabled={!isOrderingTime}
          className="w-full border border-white/20 bg-white/20 backdrop-blur-sm 
                     text-white placeholder-white/70 p-3 rounded-md 
                     focus:ring-2 focus:ring-green-400 focus:outline-none 
                     disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed transition"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-white/90">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          disabled={!isOrderingTime}
          className="w-full border border-white/20 bg-white/20 backdrop-blur-sm 
                     text-white placeholder-white/70 p-3 rounded-md 
                     focus:ring-2 focus:ring-green-400 focus:outline-none 
                     disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed transition"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-white/90">
          Phone Number<span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          required
          disabled={!isOrderingTime}
          className="w-full border border-white/20 bg-white/20 backdrop-blur-sm 
                     text-white placeholder-white/70 p-3 rounded-md 
                     focus:ring-2 focus:ring-green-400 focus:outline-none 
                     disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed transition"
          placeholder="e.g. 0301-1234567"
        />
      </div>
    </div>
  );
}
