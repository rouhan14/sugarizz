// app/api/geocode/route.js - Now using Google Distance Matrix API
import axios from "axios";
import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Store location coordinates (Lahore)
const STORE_LOCATION = {
  lat: 31.3536,
  lng: 74.2518
};

/**
 * Appends "Lahore" to an address if it's not already present
 */
function appendLahoreToAddress(address) {
  if (!address || !address.trim()) return address;
  
  const trimmedAddress = address.trim();
  const lowerCaseAddress = trimmedAddress.toLowerCase();
  
  // Check if "lahore" is already in the address (case-insensitive)
  if (lowerCaseAddress.includes('lahore')) {
    return trimmedAddress;
  }
  
  // Append "Lahore" to the address
  return `${trimmedAddress}, Lahore`;
}

export async function POST(request) {
  try {
    console.log("🚗 Distance Matrix API called");
    
    if (!GOOGLE_API_KEY) {
      console.log("❌ Google API key not configured");
      return NextResponse.json(
        { success: false, message: "Google API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { address, lat, lng, needsReverseGeocode } = body;
    console.log("📍 Request data:", { address, lat, lng, needsReverseGeocode });

    let customerLocation = "";
    let formattedAddress = "";
    
    // Determine customer location format for Distance Matrix API
    if (lat && lng) {
      customerLocation = `${lat},${lng}`;
      
      // If we need reverse geocoding, get the formatted address
      if (needsReverseGeocode) {
        try {
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
          const geocodeResponse = await axios.get(geocodeUrl);
          
          if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
            formattedAddress = geocodeResponse.data.results[0].formatted_address;
            console.log("🏠 Reverse geocoded address:", formattedAddress);
          }
        } catch (error) {
          console.warn("⚠️ Reverse geocoding failed:", error.message);
        }
      }
    } else if (address) {
      // Use address directly, append Lahore if needed
      const addressWithLahore = appendLahoreToAddress(address);
      customerLocation = encodeURIComponent(addressWithLahore);
      formattedAddress = addressWithLahore;
      console.log("🏠 Using address:", addressWithLahore);
    } else {
      console.log("❌ No address or coordinates provided");
      return NextResponse.json(
        { success: false, message: "Either address or coordinates must be provided" },
        { status: 400 }
      );
    }

    // Build Distance Matrix API URL
    const storeLocationStr = `${STORE_LOCATION.lat},${STORE_LOCATION.lng}`;
    const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${storeLocationStr}&destinations=${customerLocation}&key=${GOOGLE_API_KEY}&units=metric&mode=driving&avoid=tolls`;

    console.log("🌐 Making request to Distance Matrix API...");
    const response = await axios.get(distanceMatrixUrl);
    console.log("📊 Distance Matrix API response status:", response.data.status);
    
    const { rows } = response.data;

    if (!rows || rows.length === 0 || !rows[0].elements || rows[0].elements.length === 0) {
      console.log("❌ No results found from Distance Matrix API");
      console.log("📊 API status:", response.data.status);
      console.log("📊 API error message:", response.data.error_message);
      
      let errorMessage = "Unable to calculate distance to your location. Please try a different address.";
      if (response.data.status === 'REQUEST_DENIED') {
        errorMessage = "Distance calculation service unavailable. Please ensure the Distance Matrix API is enabled.";
      } else if (response.data.status === 'OVER_QUERY_LIMIT') {
        errorMessage = "Service temporarily unavailable. Please try again later.";
      } else if (response.data.status === 'ZERO_RESULTS') {
        errorMessage = "No route found to your location. Please try a more specific address.";
      } else if (response.data.status === 'INVALID_REQUEST') {
        errorMessage = "Invalid address format. Please check your address.";
      }
      
      return NextResponse.json({
        success: false,
        message: errorMessage,
        debug: response.data.status
      });
    }

    const element = rows[0].elements[0];
    
    if (element.status !== 'OK') {
      console.log("❌ Distance calculation failed:", element.status);
      
      let errorMessage = "Unable to calculate route to your location.";
      if (element.status === 'NOT_FOUND') {
        errorMessage = "Location not found. Please provide a more specific address.";
      } else if (element.status === 'ZERO_RESULTS') {
        errorMessage = "No driving route available to your location.";
      }
      
      return NextResponse.json({
        success: false,
        message: errorMessage,
        debug: element.status
      });
    }

    console.log("✅ Distance calculated successfully");
    
    // Extract distance and duration
    const distanceInMeters = element.distance.value;
    const distanceInKm = distanceInMeters / 1000;
    const durationInSeconds = element.duration.value;
    const durationInMinutes = Math.round(durationInSeconds / 60);
    
    console.log(`📏 Distance: ${distanceInKm.toFixed(2)} km, Duration: ${durationInMinutes} minutes`);

    // Get customer coordinates if we used address input
    let customerCoordinates = null;
    if (lat && lng) {
      customerCoordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };
    } else if (address) {
      // We need to geocode the address to get coordinates for the response
      try {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(formattedAddress)}&key=${GOOGLE_API_KEY}`;
        const geocodeResponse = await axios.get(geocodeUrl);
        
        if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
          const location = geocodeResponse.data.results[0].geometry.location;
          customerCoordinates = { lat: location.lat, lng: location.lng };
          // Update formatted address with geocoded result if we don't have one
          if (!formattedAddress) {
            formattedAddress = geocodeResponse.data.results[0].formatted_address;
          }
        }
      } catch (error) {
        console.warn("⚠️ Geocoding for coordinates failed:", error.message);
      }
    }

    return NextResponse.json({
      success: true,
      distance: {
        text: element.distance.text,
        value: distanceInMeters,
        km: parseFloat(distanceInKm.toFixed(2))
      },
      duration: {
        text: element.duration.text,
        value: durationInSeconds,
        minutes: durationInMinutes
      },
      coordinates: customerCoordinates,
      address: formattedAddress || address,
      storeLocation: STORE_LOCATION
    });
    
  } catch (error) {
    console.error("❌ Distance Matrix API error:", error);
    console.error("❌ Error details:", error.response?.data || error.message);
    return NextResponse.json(
      { 
        success: false, 
        message: "Unable to calculate distance. Please check your internet connection and try again." 
      },
      { status: 500 }
    );
  }
}
