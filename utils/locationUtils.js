// utils/locationUtils.js - Updated to use Distance Matrix API

/**
 * Calculate road distance and delivery details using Google Distance Matrix API
 * This replaces the old Haversine calculation with actual road distance
 */
export async function calculateDistanceAndDelivery(address = null, lat = null, lng = null, needsReverseGeocode = false) {
  try {
    if (!address && (!lat || !lng)) {
      throw new Error("Either address or coordinates must be provided");
    }

    const response = await fetch('/api/geocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        address, 
        lat, 
        lng, 
        needsReverseGeocode 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Unable to calculate distance"
      };
    }

    return {
      success: true,
      distance: data.distance, // { text, value, km }
      duration: data.duration, // { text, value, minutes }
      coordinates: data.coordinates, // { lat, lng }
      address: data.address, // formatted address
      storeLocation: data.storeLocation
    };
    
  } catch (error) {
    console.error("Distance calculation error:", error);
    return {
      success: false,
      message: "Unable to calculate distance. Please check your internet connection and try again."
    };
  }
}

/**
 * Legacy function for backward compatibility - now uses Distance Matrix API
 * @deprecated Use calculateDistanceAndDelivery instead
 */
export async function geocodeAddress(address = null, lat = null, lng = null) {
  const result = await calculateDistanceAndDelivery(address, lat, lng, !address);
  
  if (!result.success) {
    if (address) {
      return result;
    } else {
      throw new Error(result.message);
    }
  }
  
  if (address) {
    // Return format expected by address-based calls
    return {
      success: true,
      lat: result.coordinates?.lat,
      lng: result.coordinates?.lng,
      address: result.address,
      distance: result.distance,
      duration: result.duration
    };
  } else {
    // Return format expected by coordinate-based calls (reverse geocoding)
    return result.address;
  }
}

/**
 * @deprecated This function is no longer needed as we use Google's road distance
 * Keeping for backward compatibility, but it will return 0
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  console.warn('calculateDistance is deprecated. Use calculateDistanceAndDelivery instead.');
  return 0;
}
