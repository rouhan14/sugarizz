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
          <span className={meetsMinimumOrder ? 'text-gray-600' : 'text-orange-600'}>
            Rs. {finalPrice.toLocaleString()}
            {!meetsMinimumOrder && (
              <span className="text-xs ml-1">(Min: {minimumOrderAmount.toLocaleString()})</span>
            )}
          </span>
        </div>

        {paymentMethod !== 'cod' && (
        <div className="flex justify-between text-gray-600">
          <span className="text-green-600 text-sm">10% Discount Applied:</span>
          <span className='text-green-600 text-sm'>
            Rs. -{discount}
          </span>
        </div>)}

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
      {!meetsMinimumOrder && (
        <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-4">
          <p className="text-orange-700 text-sm font-medium">⚠️ Minimum Order Required</p>
          <p className="text-orange-600 text-xs mt-1">
            Add Rs. {(minimumOrderAmount - finalPrice).toLocaleString()} more to meet minimum order of Rs. {minimumOrderAmount.toLocaleString()}
          </p>
        </div>
      )}

      {!isWithinRange && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-700 text-sm font-medium">⚠️ Outside Delivery Zone</p>
          <p className="text-red-600 text-xs mt-1">
            Please enter an address within our delivery areas
          </p>
        </div>
      )}

      {deliveryDetails && isWithinRange && meetsMinimumOrder && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
          <p className="text-green-700 text-sm font-medium">✅ Ready to Order</p>
          <p className="text-green-600 text-xs mt-1">
            Your order will be delivered in {deliveryDetails.eta}
          </p>
        </div>
      )}

      {/* Total */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-bold text-gray-800">
          <span>Total:</span>
          <span className={isWithinRange && meetsMinimumOrder ? 'text-gray-800' : 'text-gray-400'}>
            Rs. {isWithinRange && meetsMinimumOrder ? total.toLocaleString() : '---'}
          </span>
        </div>
      </div>

      {/* Zone Information */}
      {isWithinRange && deliveryDetails && meetsMinimumOrder && (
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