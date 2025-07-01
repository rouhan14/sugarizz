"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import useCookieStore from "@/store/cookieStore";
import data from "@/data";

// Constants
const STORE_LOCATION = { lat: 31.3536, lng: 74.2518 };
const DELIVERY_RADIUS_KM = 12;

// Lazy-load map component
const Map = dynamic(() => import('../../components/mapComponent'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-200 flex items-center justify-center">Loading map...</div>
});

// Error Modal Component
const ErrorModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.1)" }}>
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
        <div className="bg-red-500 p-4 rounded-t-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = val => (val * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const Checkout = () => {
  const [markerPos, setMarkerPos] = useState(STORE_LOCATION);
  const [mapCenter, setMapCenter] = useState(STORE_LOCATION);
  const [manualAddress, setManualAddress] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [isWithinRange, setIsWithinRange] = useState(true);
  const [mapKey, setMapKey] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showErrorModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const router = useRouter();
  const quantities = useCookieStore((state) => state.quantities);

  const cartItems = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([title, quantity]) => {
      const itemData = data.find((item) => item.title === title);
      return {
        name: itemData.title,
        price: itemData.price,
        quantity,
        image: itemData.image,
        title: itemData.title,
      };
    });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharges = isWithinRange ? 150 : 0;
  const total = subtotal + deliveryCharges;

  const handleGeocodeAddress = async () => {
    if (!manualAddress.trim()) return;

    try {
      const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: { address: manualAddress, key: GOOGLE_API_KEY },
      });

      const results = res.data.results;
      if (!results || results.length === 0) {
        showErrorModal("Address Not Found", "We couldn't find the address. Please try again.");
        return;
      }

      const { lat, lng } = results[0].geometry.location;
      setMarkerPos({ lat, lng });
      setMapCenter({ lat, lng });
      setResolvedAddress(results[0].formatted_address);
      setMapKey(prev => prev + 1);

      const distance = calculateDistance(STORE_LOCATION.lat, STORE_LOCATION.lng, lat, lng);
      if (distance > DELIVERY_RADIUS_KM) {
        setIsWithinRange(false);
        showErrorModal(
          "Out of Delivery Zone",
          `This location is ${distance.toFixed(2)} km away. We only deliver within ${DELIVERY_RADIUS_KM} km of our store.`
        );
      } else {
        setIsWithinRange(true);
      }
    } catch (err) {
      console.error(err);
      showErrorModal("Geocoding Error", "Something went wrong while checking your address. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isWithinRange) {
      showErrorModal("Delivery Zone Error", "Please enter an address within our delivery zone.");
      return;
    }

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const phoneNumber = formData.get("phone");
    const additionalRecommendations = formData.get("recommendations");
    const address = resolvedAddress || manualAddress;
    const deliveryZone = "Zone A";

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
          address,
          cookies: cartItems,
          deliveryZone,
          deliveryCharges,
          totalPrice: total,
          additionalRecommendations,
        }),
      });

      const result = await res.json();

      if (result.success) {
        router.push("/thank-you");
      } else {
        showErrorModal("Order Failed", result.message || "Something went wrong placing your order.");
      }
    } catch (err) {
      console.error(err);
      showErrorModal("Unexpected Error", "We couldn't process your order. Please try again later.");
    }
  };

  return (
    <div className="mx-auto p-6">
      <ErrorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <h1 className="text-3xl font-bold mb-6 text-center text-white">Checkout</h1>

      <div className="max-w-6xl mx-auto p-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT - FORM */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name<span className="text-red-500">*</span></label>
              <input type="text" name="name" required className="w-full border border-gray-300 p-2 rounded-md" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email<span className="text-red-500">*</span></label>
              <input type="email" name="email" required className="w-full border border-gray-300 p-2 rounded-md" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone Number<span className="text-red-500">*</span></label>
              <input type="tel" name="phone" required className="w-full border border-gray-300 p-2 rounded-md" />
            </div>
          </div>

          {/* PAYMENT */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Payment</h2>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" value="cod" checked readOnly />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block mb-1 font-medium">
              Enter Address<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-2 w-full">
              <input
                type="text"
                value={manualAddress}
                onChange={e => setManualAddress(e.target.value)}
                placeholder="Type your address here"
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
              <button
                type="button"
                onClick={handleGeocodeAddress}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Check
              </button>
            </div>
            {resolvedAddress && (
              <p className="text-sm mt-2">
                Resolved Address: <strong>{resolvedAddress}</strong>
              </p>
            )}
          </div>

          {/* MAP */}
          <div className="h-[300px] w-full border border-gray-300 rounded-md overflow-hidden">
            <Map
              key={mapKey}
              center={mapCenter}
              markerPos={markerPos}
              storeLocation={STORE_LOCATION}
              deliveryRadius={DELIVERY_RADIUS_KM}
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="block mb-1 font-medium">Additional Recommendations (optional)</label>
            <textarea name="recommendations" rows="3" className="w-full border border-gray-300 p-2 rounded-md" />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={!isWithinRange}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Place Order
          </button>
        </form>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Your Order</h2>
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex items-center mb-4">
              <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded mr-4" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">x {item.quantity}</p>
              </div>
              <div className="font-medium">Rs. {item.price * item.quantity}</div>
            </div>
          ))}
          <hr className="my-4" />
          <div className="flex justify-between mb-2"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
          <div className="flex justify-between mb-2"><span>Delivery Charges</span><span>{isWithinRange ? `Rs. ${deliveryCharges}` : "Out of zone"}</span></div>
          <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>Rs. {total}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
