"use client";

import React from "react";

const OrderSummaryExtras = ({
  meetsMinimumOrder,
  MINIMUM_ORDER_AMOUNT,
  subtotal,
  deliveryDetails,
  getDeliveryZoneName,
  isOrderingTime
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Minimum Order Notice */}
      {!meetsMinimumOrder && (
        <div className="backdrop-blur-md bg-orange-500/10 border border-orange-300/30 rounded-2xl p-4 shadow-md transition-all text-orange-100">
          <h3 className="font-semibold mb-2 text-orange-200">⚠️ Minimum Order Required</h3>
          <p className="text-sm">
            Minimum order amount is Rs. {MINIMUM_ORDER_AMOUNT.toLocaleString()}.
            You need Rs. {(MINIMUM_ORDER_AMOUNT - subtotal).toLocaleString()} more to place this order.
          </p>
        </div>
      )}

      {/* Delivery Zone Info */}
      {deliveryDetails && (
        <div className="backdrop-blur-md bg-green-500/10 border border-green-300/30 rounded-2xl p-4 shadow-md transition-all text-green-100">
          <h3 className="font-semibold mb-2 text-green-200">🚚 Delivery Information</h3>
          <div className="text-sm space-y-1">
            <p><strong>Zone:</strong> {getDeliveryZoneName()}</p>
            <p><strong>Delivery Charge:</strong> Rs. {deliveryDetails.charge}</p>
            <p><strong>Estimated Time:</strong> {deliveryDetails.eta}</p>
          </div>
        </div>
      )}

      {/* Additional Notes */}
      <div>
        <label className="block mb-1 font-medium text-white">
          Additional Recommendations (optional)
        </label>
        <textarea
          name="recommendations"
          rows="3"
          disabled={!isOrderingTime}
          placeholder="Any special instructions for your order..."
          className="w-full bg-white/10 border border-white/30 text-white placeholder-white/50 backdrop-blur-md p-3 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-300/30 disabled:cursor-not-allowed transition-all"
        />
      </div>
    </div>
  );
};

export default OrderSummaryExtras;
