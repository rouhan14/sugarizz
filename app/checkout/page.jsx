"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useCookieStore from "@/store/cookieStore";
import data from "@/data";
import ErrorModal from "@/components/errorModal";
import LocationService from "@/components/locationService";
import AddressForm from "@/components/addressForm";
import OrderSummary from "@/components/orderSummary";
import { calculateDistance, geocodeAddress } from "@/utils/locationUtils";

const STORE_LOCATION = { lat: 31.3536, lng: 74.2518 };
const DELIVERY_RADIUS_KM = 12;

const Map = dynamic(() => import('../../components/mapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-gray-200 flex items-center justify-center">
      Loading map...
    </div>
  )
});

const Checkout = () => {
  const [userInputAddress, setUserInputAddress] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationFetchedViaGPS, setLocationFetchedViaGPS] = useState(false);
  const [markerPos, setMarkerPos] = useState(STORE_LOCATION);
  const [mapCenter, setMapCenter] = useState(STORE_LOCATION);
  const [isWithinRange, setIsWithinRange] = useState(true);
  const [mapKey, setMapKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();
  const { quantities, resetQuantities } = useCookieStore();

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

  const showErrorModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const updateMapLocation = (lat, lng, address = "") => {
    const newPosition = { lat, lng };
    setMarkerPos(newPosition);
    setMapCenter(newPosition);
    setMapKey(prev => prev + 1);

    if (address) {
      setResolvedAddress(address);
    }

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
  };

  const handleLocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setCurrentLocation({ lat: latitude, lng: longitude });
    reverseGeocode(latitude, longitude);
    updateMapLocation(latitude, longitude);
    setLocationFetchedViaGPS(true);
  };

  const handleLocationError = () => {
    if (userInputAddress.trim()) {
      handleGeocodeUserAddress();
    } else {
      showErrorModal(
        "Location Required",
        "Please allow location access or enter your address manually."
      );
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const address = await geocodeAddress(null, lat, lng);
      setResolvedAddress(address);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const handleGeocodeUserAddress = async () => {
    if (!userInputAddress.trim()) {
      showErrorModal("Address Required", "Please enter your address.");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await geocodeAddress(userInputAddress);
      if (result.success) {
        updateMapLocation(result.lat, result.lng, result.address);
        setResolvedAddress(result.address);
      } else {
        showErrorModal("Address Not Found", result.message);
      }
    } catch (error) {
      showErrorModal("Geocoding Error", "Something went wrong while checking your address.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMapMarkerDrag = (lat, lng) => {
    updateMapLocation(lat, lng);
    reverseGeocode(lat, lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isWithinRange) {
      showErrorModal("Delivery Zone Error", "Please enter an address within our delivery zone.");
      return;
    }

    if (!userInputAddress.trim()) {
      showErrorModal("Address Required", "Please enter your delivery address.");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData(e.target);
    const orderData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phoneNumber: formData.get("phone"),
      userInputAddress,
      resolvedAddress,
      coordinates: currentLocation || markerPos,
      cookies: cartItems,
      deliveryZone: "Zone A",
      deliveryCharges,
      totalPrice: total,
      additionalRecommendations: formData.get("recommendations"),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (result.success) {
        resetQuantities();
        router.push("/thank-you");
      } else {
        showErrorModal("Order Failed", result.message || "Something went wrong placing your order.");
      }
    } catch (err) {
      console.error(err);
      showErrorModal("Unexpected Error", "We couldn't process your order. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ErrorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <h1 className="text-3xl font-bold mb-6 text-center text-white">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:flex-row-reverse">
        <div className="order-1 lg:order-2">
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            deliveryCharges={deliveryCharges}
            total={total}
            isWithinRange={isWithinRange}
          />
        </div>

        <div className="order-2 lg:order-1 bg-white p-6 sm:p-8 rounded-lg shadow-md w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Customer Information
              </h2>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <LocationService
              onLocationSuccess={handleLocationSuccess}
              onLocationError={handleLocationError}
            />

            <AddressForm
              userInputAddress={userInputAddress}
              setUserInputAddress={setUserInputAddress}
              resolvedAddress={resolvedAddress}
              onGeocodeAddress={handleGeocodeUserAddress}
              isProcessing={isProcessing}
              isLocationFromGPS={locationFetchedViaGPS}
            />

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Payment Method</h2>
              <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                <label className="flex items-center gap-3">
                  <input type="radio" name="payment" value="cod" checked readOnly className="w-4 h-4" />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Additional Recommendations (optional)
              </label>
              <textarea
                name="recommendations"
                rows="3"
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special instructions for your order..."
              />
            </div>

            <button
              type="submit"
              disabled={!isWithinRange || isProcessing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
