// components/OrderSummary.jsx
import React from 'react';

const OrderSummary = ({ cartItems, subtotal, deliveryCharges, total, isWithinRange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Your Order</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item, idx) => (
          <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-16 h-16 object-cover rounded-lg mr-4 border border-gray-200" 
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-sm text-gray-600">Price: Rs. {item.price} each</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-gray-800">
                Rs. {item.price * item.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-gray-700">
          <span className="font-medium">Subtotal</span>
          <span>Rs. {subtotal}</span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span className="font-medium">Delivery Charges</span>
          <span className={isWithinRange ? "text-gray-700" : "text-red-500"}>
            {isWithinRange ? `Rs. ${deliveryCharges}` : "Out of zone"}
          </span>
        </div>
        
        {!isWithinRange && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              ⚠️ This location is outside our delivery zone. Please choose an address within our delivery area.
            </p>
          </div>
        )}
        
        <hr className="border-gray-300" />
        
        <div className="flex justify-between text-xl font-bold text-gray-800">
          <span>Total</span>
          <span className={isWithinRange ? "text-green-600" : "text-red-500"}>
            Rs. {isWithinRange ? total : subtotal}
          </span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Delivery Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Free delivery on orders above Rs. 2000</li>
              <li>• Delivery within 12 km radius</li>
              <li>• Estimated delivery: 30-45 minutes</li>
              <li>• Cash on delivery available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;