// app/api/geocode/route.js
import axios from "axios";
import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Store location (you can use either coords OR address string)
const STORE_LOCATION = "31.3673,74.2588"; // or "Lake City, Lahore"

export async function POST(request) {
  try {
    console.log("🚗 Distance Matrix API called");

    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { success: false, message: "Google API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { address, lat, lng } = body;
    console.log("📍 Request data:", { address, lat, lng });

    let customerLocation = "";

    if (lat && lng) {
      // Use coordinates directly
      customerLocation = `${lat},${lng}`;
    } else if (address) {
      // Use address directly (no encoding here, API will handle spaces/commas fine)
      customerLocation = address;
    } else {
      return NextResponse.json(
        { success: false, message: "Either address or coordinates must be provided" },
        { status: 400 }
      );
    }

    // Build Distance Matrix API URL
    const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${STORE_LOCATION}&destinations=${encodeURIComponent(
      customerLocation
    )}&key=${GOOGLE_API_KEY}&units=metric&mode=driving`;

    console.log("🌐 Making request:", distanceMatrixUrl);

    const response = await axios.get(distanceMatrixUrl);
    console.log("📊 Distance Matrix API status:", response.data.status);

    const element = response.data?.rows?.[0]?.elements?.[0];
    if (!element || element.status !== "OK") {
      return NextResponse.json({
        success: false,
        message: "Unable to calculate distance",
        debug: element?.status || response.data.status
      });
    }

    const distanceInMeters = element.distance.value;
    const distanceInKm = distanceInMeters / 1000;
    const durationInSeconds = element.duration.value;
    const durationInMinutes = Math.round(durationInSeconds / 60);

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
      storeLocation: STORE_LOCATION,
      customer: customerLocation
    });
  } catch (error) {
    console.error("❌ Distance Matrix API error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to calculate distance. Please check your input or API key."
      },
      { status: 500 }
    );
  }
}
