import React from 'react';

const AddressForm = ({
  userInputAddress,
  setUserInputAddress,
  resolvedAddress,
  onGeocodeAddress,
  isProcessing,
  isLocationFromGPS
}) => {
  return (
    <div className="w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 space-y-4 transition-all duration-300">

      <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
        Delivery Address
      </h3>

      {/* User Input Address */}
      <div>
        <label className="block mb-2 font-medium text-white">
          Enter Your Address<span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <textarea
            value={userInputAddress}
            onChange={(e) => setUserInputAddress(e.target.value)}
            placeholder="Enter your complete delivery address (house number, street, area, city, etc.)"
            className="w-full bg-white/10 border border-white/30 backdrop-blur-md p-3 rounded-md text-white placeholder-white/60 focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none transition-all"
            rows={3}
            required
          />

          {/* Only show verify button if location is NOT from GPS */}
          {!isLocationFromGPS && (
            <button
              type="button"
              onClick={onGeocodeAddress}
              disabled={isProcessing || !userInputAddress.trim()}
              className="w-full bg-green-500/70 hover:bg-green-500/40 border border-white/20 backdrop-blur-md text-white px-4 py-2 rounded-md shadow-[inset_0_0_4px_rgba(255,255,255,0.2),_0_4px_10px_rgba(0,128,0,0.35)] hover:shadow-[inset_0_0_6px_rgba(255,255,255,0.25),_0_6px_14px_rgba(0,128,0,0.45)] transition-all duration-300 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin inline-block -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking Address...
                </>
              ) : (
                <>
                  <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4V17m-6-3l6 3" />
                  </svg>
                  Verify Address & Check Delivery Zone
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Resolved Address Display */}
      {resolvedAddress && (
        <div className="bg-green-500/10 border border-green-400/30 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-200 mb-1">
                Verified Delivery Address
              </h4>
              <p className="text-sm text-green-100 leading-relaxed">
                {resolvedAddress}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Address Explanation */}
{/*       <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-gray-200 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-white mb-1">
              How we handle your address
            </h4>
            <ul className="text-sm text-gray-200 space-y-1">
              <li>• <strong>Your Input:</strong> We save your address exactly as you type it</li>
              <li>• <strong>Verification:</strong> We verify and standardize the address for delivery</li>
              <li>• <strong>Both addresses</strong> are included in your order confirmation</li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AddressForm;
