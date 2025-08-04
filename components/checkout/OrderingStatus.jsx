"use client";

import React from "react";

export default function OrderingStatus({ isOrderingTime, currentTime, nextOrderingTime }) {
  return (
    <div
      className={`
        mb-6 p-4 rounded-xl w-full
        border border-white/20
        backdrop-blur-md
        ${isOrderingTime ? 'bg-green-500/10' : 'bg-red-500/10'}
        shadow-[inset_0_0_6px_rgba(255,255,255,0.1),_0_4px_12px_rgba(0,0,0,0.2)]
        transition-all duration-300
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`w-3 h-3 rounded-full ${isOrderingTime ? 'bg-green-400' : 'bg-red-400'}`}
        ></span>
        <h3
          className={`font-semibold text-sm ${isOrderingTime ? 'text-green-200' : 'text-red-200'}`}
        >
          {isOrderingTime ? 'Orders Open' : 'Orders Closed'}
        </h3>
      </div>

      <div className={`text-sm space-y-1 ${isOrderingTime ? 'text-green-100' : 'text-red-100'}`}>
        <p><strong>Current Time (Pakistan):</strong> {currentTime}</p>
        <p><strong>Ordering Hours:</strong> 1:00 PM - 11:00 PM (Pakistan Time)</p>
        {!isOrderingTime && (
          <p><strong>Next Available:</strong> {nextOrderingTime}</p>
        )}
      </div>
    </div>
  );
}
