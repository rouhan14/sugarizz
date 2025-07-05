"use client";

import React from "react";

const PaymentMethod = ({ selected, onChange, isOrderingTime = true }) => {
  const optionClasses = (isActive) =>
    `rounded-xl p-4 border transition-all duration-300 backdrop-blur-md 
     ${isOrderingTime
        ? isActive
          ? "bg-green-500/10 border-white/30 shadow-[inset_0_0_4px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,128,0,0.2)]"
          : "bg-white/10 border-white/20 hover:bg-white/20 shadow-md cursor-pointer"
        : "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"}`;

  return (
    <div className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-white border-b border-white/30 pb-2">
        Payment Method
      </h2>

      <div className="flex flex-col gap-4">
        {/* Cash on Delivery */}
        <div className={optionClasses(selected === "cod")} onClick={() => onChange("cod")}>
          <label className="flex items-center gap-3 cursor-pointer text-white">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={selected === "cod"}
              onChange={() => onChange("cod")}
              disabled={!isOrderingTime}
              className="w-4 h-4 accent-green-500"
            />
            <span className="font-medium">Cash on Delivery</span>
          </label>
        </div>

        {/* Online Payment */}
        <div className={optionClasses(selected === "online")} onClick={() => onChange("online")}>
          <label className="flex items-center gap-3 cursor-pointer text-white">
            <input
              type="radio"
              name="payment"
              value="online"
              checked={selected === "online"}
              onChange={() => onChange("online")}
              disabled={!isOrderingTime}
              className="w-4 h-4 accent-green-500"
            />
            <span className="font-medium">
              Online Payment – <span className="text-green-300 font-semibold">10% OFF</span>
            </span>
          </label>

          {/* Expand Card Info */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out text-white/90 ${selected === "online" ? "max-h-40 mt-4" : "max-h-0"
              }`}
          >
            <div className="pl-7 text-sm space-y-1">
              <div>
                <span className="font-semibold">Account Number:</span> 03160574308
              </div>
              <div>
                <span className="font-semibold">Bank:</span> EasyPaisa
              </div>
              <div>
                <span className="font-semibold">Name:</span> Abdur Rehman
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
