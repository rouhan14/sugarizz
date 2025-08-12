// utils/locationUtils.js

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = val => (val * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) ** 2 + 
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Geocode an address or reverse geocode coordinates using server-side API
 */
export async function geocodeAddress(address = null, lat = null, lng = null) {
  try {
    if (!address && (!lat || !lng)) {
      throw new Error("Either address or coordinates must be provided");
    }

    const response = await fetch('/api/geocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, lat, lng }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Unable to geocode address"
      };
    }

    if (address) {
      // Return geocoded coordinates and formatted address for forward geocoding
      return data;
    } else {
      // Return formatted address for reverse geocoding
      return data.address;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    if (address) {
      return {
        success: false,
        message: "Unable to verify address. Please check your internet connection and try again."
      };
    } else {
      throw error;
    }
  }
}