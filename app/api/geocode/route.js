// app/api/geocode/route.js
import axios from "axios";
import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Note: No NEXT_PUBLIC_ prefix for server-only

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
    console.log("🔍 Geocoding API called");
    
    if (!GOOGLE_API_KEY) {
      console.log("❌ Google API key not configured");
      return NextResponse.json(
        { success: false, message: "Google API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { address, lat, lng } = body;
    console.log("📍 Request data:", { address, lat, lng });

    let url = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_API_KEY}`;
    
    if (address) {
      // Forward geocoding - automatically append Lahore to the address
      const addressWithLahore = appendLahoreToAddress(address);
      url += `&address=${encodeURIComponent(addressWithLahore)}`;
      console.log("🏠 Geocoding address:", addressWithLahore);
    } else if (lat && lng) {
      // Reverse geocoding
      url += `&latlng=${lat},${lng}`;
      console.log("🌍 Reverse geocoding coordinates:", lat, lng);
    } else {
      console.log("❌ No address or coordinates provided");
      return NextResponse.json(
        { success: false, message: "Either address or coordinates must be provided" },
        { status: 400 }
      );
    }

    console.log("🌐 Making request to Google API...");
    const response = await axios.get(url);
    console.log("📊 Google API response status:", response.data.status);
    console.log("📊 Google API results count:", response.data.results?.length || 0);
    
    const results = response.data.results;

    if (!results || results.length === 0) {
      console.log("❌ No results found from Google API");
      console.log("📊 Google API status:", response.data.status);
      console.log("📊 Google API error message:", response.data.error_message);
      console.log("📊 Full Google API response:", JSON.stringify(response.data, null, 2));
      
      // Return more specific error message based on Google API status
      let errorMessage = "Address not found. Please try a different address.";
      if (response.data.status === 'REQUEST_DENIED') {
        errorMessage = "Geocoding service unavailable. Please ensure the Geocoding API is enabled in Google Cloud Console.";
      } else if (response.data.status === 'OVER_QUERY_LIMIT') {
        errorMessage = "Service temporarily unavailable. Please try again later.";
      } else if (response.data.status === 'ZERO_RESULTS') {
        errorMessage = "Address not found. Please try a more specific address.";
      } else if (response.data.status === 'INVALID_REQUEST') {
        errorMessage = "Invalid address format. Please check your address.";
      }
      
      return NextResponse.json({
        success: false,
        message: errorMessage,
        debug: response.data.status // Add debug info
      });
    }

    console.log("✅ Address found successfully");
    const result = results[0];
    const location = result.geometry.location;

    if (address) {
      // Return geocoded coordinates and formatted address
      return NextResponse.json({
        success: true,
        lat: location.lat,
        lng: location.lng,
        address: result.formatted_address
      });
    } else {
      // Return formatted address for reverse geocoding
      return NextResponse.json({
        success: true,
        address: result.formatted_address
      });
    }
  } catch (error) {
    console.error("❌ Geocoding error:", error);
    console.error("❌ Error details:", error.response?.data || error.message);
    return NextResponse.json(
      { 
        success: false, 
        message: "Unable to verify address. Please check your internet connection and try again." 
      },
      { status: 500 }
    );
  }
}
