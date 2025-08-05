// components/LocationService.jsx
import React, { useState } from 'react';

const LocationService = ({ onLocationSuccess, onLocationError }) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGettingLocation(false);
        setLocationPermission('granted');
        onLocationSuccess(position);
      },
      (error) => {
        setIsGettingLocation(false);
        setLocationPermission('denied');
        console.error("Error getting location:", error);
        
        let errorMessage = "Unable to get your location. ";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Location access was denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }
        
        onLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white border-b border-white/30 pb-2">
        Delivery Location
      </h2>
      
      <div className="rounded-2xl p-4 border border-white/20 backdrop-blur-sm bg-blue-400/10 shadow-[inset_0_0_2px_rgba(255,255,255,0.1),_0_2px_6px_rgba(0,0,255,0.15)] transition-all duration-150 text-white">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white border-b border-white/30 pb-2">
              Get precise location for accurate delivery
            </h3>
            <p className="text-sm mb-3">
              Allow location access for the most accurate delivery address, or enter your address manually below.
            </p>
            
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation || locationPermission === 'granted'}
              className="w-full inline-flex items-center justify-center px-4 py-2 rounded-xl text-white bg-blue-500/10 hover:bg-blue-500/20 border border-white/20 backdrop-blur-sm shadow-[inset_0_0_2px_rgba(255,255,255,0.1),_0_2px_6px_rgba(0,0,255,0.15)] hover:shadow-[inset_0_0_3px_rgba(255,255,255,0.15),_0_3px_8px_rgba(0,0,255,0.2)] transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGettingLocation ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting Location...
                </>
              ) : locationPermission === 'granted' ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Location Obtained
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Use My Location
                </>
              )}
            </button>
            
            {locationPermission === 'denied' && (
              <p className="text-sm text-red-600 mt-2">
                Location access denied. Please enter your address manually below.
              </p>
            )}
            
            {locationPermission === 'granted' && (
              <p className="text-sm text-green-300 mt-2">
                ✓ Location obtained successfully! You can still adjust the address below if needed.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationService;