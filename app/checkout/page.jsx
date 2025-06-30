"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import L from "leaflet";

// Lazy-load leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(mod => mod.Circle), { ssr: false });

// Store location: Lahore
const STORE_LOCATION = { lat: 31.3536, lng: 74.2518 };
const DELIVERY_RADIUS_KM = 12;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = val => (val * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Checkout = () => {
  const [markerPos, setMarkerPos] = useState(STORE_LOCATION);
  const [mapCenter, setMapCenter] = useState(STORE_LOCATION);
  const [manualAddress, setManualAddress] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [error, setError] = useState("");
  const [isWithinRange, setIsWithinRange] = useState(true);

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const markerRef = useRef();

  // Geocode user-inputted address
  const handleGeocodeAddress = async () => {
    if (!manualAddress.trim()) return;
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: manualAddress,
            key: GOOGLE_API_KEY,
          },
        }
      );
      const results = res.data.results;
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setMarkerPos({ lat, lng });
        setMapCenter({ lat, lng });
        setResolvedAddress(results[0].formatted_address);

        const distance = calculateDistance(STORE_LOCATION.lat, STORE_LOCATION.lng, lat, lng);
        if (distance > DELIVERY_RADIUS_KM) {
          setError(`Sorry, we currently deliver only within ${DELIVERY_RADIUS_KM} km.`);
          setIsWithinRange(false);
        } else {
          setError("");
          setIsWithinRange(true);
        }
      } else {
        setError("Address not found.");
      }
    } catch (err) {
      console.error(err);
      setError("Error while geocoding. Try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isWithinRange) {
      setError("Selected address is outside the delivery zone.");
      return;
    }
    alert("Order placed successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Customer Info */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name<span className="text-red-500">*</span></label>
            <input type="text" required className="w-full border border-gray-300 p-2 rounded-md" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email<span className="text-red-500">*</span></label>
            <input type="email" required className="w-full border border-gray-300 p-2 rounded-md" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone Number<span className="text-red-500">*</span></label>
            <input type="tel" required className="w-full border border-gray-300 p-2 rounded-md" />
          </div>
        </div>

        {/* Payment Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="cod" checked readOnly />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </div>

        {/* Address Input & Geocoding */}
        <div>
          <label className="block mb-1 font-medium">Enter Address<span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualAddress}
              onChange={e => setManualAddress(e.target.value)}
              placeholder="Type your address here"
              className="flex-1 border border-gray-300 p-2 rounded-md"
              required
            />
            <button type="button" onClick={handleGeocodeAddress} className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700">
              Check
            </button>
          </div>
          {resolvedAddress && (
            <p className="text-sm mt-2">Resolved Address: <strong>{resolvedAddress}</strong></p>
          )}
          {error && <p className="text-red-600 font-medium mt-2">{error}</p>}
        </div>

        {/* Map Display */}
        <div>
          <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={markerPos} ref={markerRef} />
            <Circle
              center={STORE_LOCATION}
              radius={DELIVERY_RADIUS_KM * 1000}
              pathOptions={{ fillColor: "green", fillOpacity: 0.2, color: "green" }}
            />
          </MapContainer>
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 font-medium">Additional Recommendations (optional)</label>
          <textarea rows="3" className="w-full border border-gray-300 p-2 rounded-md" />
        </div>

        {/* Location Link */}
        <div>
          <label className="block mb-1 font-medium">Delivery Location Link (optional)</label>
          <input type="url" className="w-full border border-gray-300 p-2 rounded-md" placeholder="Paste Google Maps link here" />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isWithinRange}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
