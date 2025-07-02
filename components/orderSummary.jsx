import React from 'react';

const OrderSummary = ({ 
  cartItems, 
  subtotal, 
  deliveryCharges, 
  total, 
  isWithinRange, 
  deliveryDetails 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
        Order Summary
      </h2>
      
      {/* Cart Items */}
      <div className="space-y-3 mb-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-medium text-gray-800">
              Rs. {(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Delivery Charges:</span>
          <span className={isWithinRange ? 'text-gray-600' : 'text-red-500'}>
            {isWithinRange ? `Rs. ${deliveryCharges.toLocaleString()}` : 'Not Available'}
          </span>
        </div>
        
        {deliveryDetails && (
          <div className="flex justify-between text-sm text-gray-500">
            <span>Estimated Delivery:</span>
            <span>{deliveryDetails.eta}</span>
          </div>
        )}
      </div>

      {/* Delivery Status */}
      {!isWithinRange && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-700 text-sm font-medium">⚠️ Outside Delivery Zone</p>
          <p className="text-red-600 text-xs mt-1">
            Please enter an address within our delivery areas
          </p>
        </div>
      )}

      {deliveryDetails && isWithinRange && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
          <p className="text-green-700 text-sm font-medium">✅ Delivery Available</p>
          <p className="text-green-600 text-xs mt-1">
            Your order will be delivered in {deliveryDetails.eta}
          </p>
        </div>
      )}

      {/* Total */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-bold text-gray-800">
          <span>Total:</span>
          <span className={isWithinRange ? 'text-gray-800' : 'text-gray-400'}>
            Rs. {isWithinRange ? total.toLocaleString() : '---'}
          </span>
        </div>
      </div>

      {/* Zone Information */}
      {isWithinRange && deliveryDetails && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Delivery Zone Information</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Charge:</strong> Rs. {deliveryDetails.charge}</p>
            <p><strong>Time:</strong> {deliveryDetails.eta}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;