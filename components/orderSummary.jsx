import React from 'react';

const OrderSummary = ({
  paymentMethod,
  cartItems,
  subtotal,
  finalPrice,
  deliveryCharges,
  total,
  isWithinRange,
  deliveryDetails,
  meetsMinimumOrder,
  minimumOrderAmount
}) => {
  const discount = subtotal - finalPrice;

  return (
    <div className="w-full max-w-2xl p-6 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-[inset_0_0_4px_rgba(255,255,255,0.1),_0_6px_14px_rgba(0,0,0,0.25)] transition-all duration-300 h-fit text-white">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">
        Order Summary
      </h2>

      {/* Cart Items */}
      <div className="space-y-3 mb-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-300">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-medium">
              Rs. {(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className={meetsMinimumOrder ? '' : 'text-orange-300'}>
            Rs. {finalPrice.toLocaleString()}
            {!meetsMinimumOrder && (
              <span className="text-xs ml-1">(Min: {minimumOrderAmount.toLocaleString()})</span>
            )}
          </span>
        </div>

        {paymentMethod !== 'cod' && (
          <div className="flex justify-between text-green-300 text-sm">
            <span>10% Discount Applied:</span>
            <span>Rs. -{discount}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Delivery Charges:</span>
          <span className={isWithinRange ? '' : 'text-red-400'}>
            {isWithinRange ? `Rs. ${deliveryCharges.toLocaleString()}` : 'Not Available'}
          </span>
        </div>

        {deliveryDetails && (
          <div className="flex justify-between text-xs text-gray-300">
            <span>Estimated Delivery:</span>
            <span>{deliveryDetails.eta}</span>
          </div>
        )}
      </div>

      {/* Delivery Status Boxes */}
      {!meetsMinimumOrder && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-md p-3 mb-4 text-orange-300">
          <p className="font-medium">⚠️ Minimum Order Required</p>
          <p className="text-xs mt-1">
            Add Rs. {(minimumOrderAmount - finalPrice).toLocaleString()} more to meet minimum order of Rs. {minimumOrderAmount.toLocaleString()}
          </p>
        </div>
      )}

      {!isWithinRange && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 mb-4 text-red-300">
          <p className="font-medium">⚠️ Outside Delivery Zone</p>
          <p className="text-xs mt-1">
            Please enter an address within our delivery areas
          </p>
        </div>
      )}

      {deliveryDetails && isWithinRange && meetsMinimumOrder && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3 mb-4 text-green-300">
          <p className="font-medium">✅ Ready to Order</p>
          <p className="text-xs mt-1">
            Your order will be delivered in {deliveryDetails.eta}
          </p>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className={isWithinRange && meetsMinimumOrder ? '' : 'text-gray-400'}>
            Rs. {isWithinRange && meetsMinimumOrder ? total.toLocaleString() : '---'}
          </span>
        </div>
      </div>

      {/* Zone Info */}
      {isWithinRange && deliveryDetails && meetsMinimumOrder && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md text-blue-200 text-sm">
          <h3 className="font-medium mb-2">Delivery Zone Information</h3>
          <div className="space-y-1 text-xs">
            <p><strong>Charge:</strong> Rs. {deliveryDetails.charge}</p>
            <p><strong>Time:</strong> {deliveryDetails.eta}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
