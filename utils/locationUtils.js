// utils/locationUtils.js
import axios from "axios";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

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
 * Geocode an address or reverse geocode coordinates
 */
export async function geocodeAddress(address = null, lat = null, lng = null) {
  try {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_API_KEY}`;
    
    if (address) {
      // Forward geocoding
      url += `&address=${encodeURIComponent(address)}`;
    } else if (lat && lng) {
      // Reverse geocoding
      url += `&latlng=${lat},${lng}`;
    } else {
      throw new Error("Either address or coordinates must be provided");
    }

    const response = await axios.get(url);
    const results = response.data.results;

    if (!results || results.length === 0) {
      return {
        success: false,
        message: "Address not found. Please try a different address."
      };
    }

    const result = results[0];
    const location = result.geometry.location;

    if (address) {
      // Return geocoded coordinates and formatted address
      return {
        success: true,
        lat: location.lat,
        lng: location.lng,
        address: result.formatted_address
      };
    } else {
      // Return formatted address for reverse geocoding
      return result.formatted_address;
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