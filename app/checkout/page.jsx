"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useCookieStore from "@/store/cookieStore";
import data from "@/data";
import ErrorModal from "@/components/errorModal";
import LocationService from "@/components/locationService";
import AddressForm from "@/components/addressForm";
import OrderSummary from "@/components/orderSummary";
import { calculateDistance, geocodeAddress } from "@/utils/locationUtils";
import { getDeliveryDetails } from "@/utils/getDeliveryDetails";

// Constants
const STORE_LOCATION = { lat: 31.3536, lng: 74.2518 };
const MAX_DELIVERY_DISTANCE = 20; // Maximum delivery distance in km
const MINIMUM_ORDER_AMOUNT = 1200; // Minimum order amount in Rs.
const ORDERING_START_HOUR = 13; // 2 PM in 24-hour format
const ORDERING_END_HOUR = 23; // 10 PM in 24-hour format
const PAKISTAN_TIMEZONE = 'Asia/Karachi';

// Lazy-load map component
// const Map = dynamic(() => import('../../components/mapComponent'), {
//   ssr: false,
//   loading: () => (
//     <div className="h-[300px] w-full bg-gray-200 flex items-center justify-center">
//       Loading map...
//     </div>
//   )
// });

const Checkout = () => {
  // Address states
  const [userInputAddress, setUserInputAddress] = useState(""); // First address - user input
  const [resolvedAddress, setResolvedAddress] = useState(""); // Second address - resolved/location
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationFetchedViaGPS, setLocationFetchedViaGPS] = useState(false);

  // Map states
  const [markerPos, setMarkerPos] = useState(STORE_LOCATION);
  const [mapCenter, setMapCenter] = useState(STORE_LOCATION);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Loading state
  const [isProcessing, setIsProcessing] = useState(false);

  // Time-based ordering states
  const [isOrderingTime, setIsOrderingTime] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [nextOrderingTime, setNextOrderingTime] = useState("");

  const router = useRouter();
  const { quantities, resetQuantities } = useCookieStore();

  // Function to check if current time is within ordering hours
  const checkOrderingTime = () => {
    const now = new Date();
    const pakistanTime = new Date(now.toLocaleString("en-US", { timeZone: PAKISTAN_TIMEZONE }));
    const currentHour = pakistanTime.getHours();

    // Format current time for display
    const timeString = pakistanTime.toLocaleString("en-US", {
      timeZone: PAKISTAN_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    setCurrentTime(timeString);

    // Check if within ordering hours
    const withinHours = currentHour >= ORDERING_START_HOUR && currentHour < ORDERING_END_HOUR;
    setIsOrderingTime(withinHours);

    // Calculate next ordering time
    if (!withinHours) {
      const nextOrdering = new Date(pakistanTime);
      if (currentHour >= ORDERING_END_HOUR) {
        // After 10 PM, next ordering is tomorrow at 2 PM
        nextOrdering.setDate(nextOrdering.getDate() + 1);
        nextOrdering.setHours(ORDERING_START_HOUR, 0, 0, 0);
      } else {
        // Before 2 PM, next ordering is today at 2 PM
        nextOrdering.setHours(ORDERING_START_HOUR, 0, 0, 0);
      }

      const nextTimeString = nextOrdering.toLocaleString("en-US", {
        timeZone: PAKISTAN_TIMEZONE,
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setNextOrderingTime(nextTimeString);
    }
  };

  // Update time every minute
  useEffect(() => {
    checkOrderingTime();
    const interval = setInterval(checkOrderingTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

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
  const deliveryCharges = deliveryDetails ? deliveryDetails.charge : 0;
  const total = subtotal + deliveryCharges;
  const isWithinRange = deliveryDetails !== null;
  const meetsMinimumOrder = subtotal >= MINIMUM_ORDER_AMOUNT;

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
    const zoneDetails = getDeliveryDetails(distance);

    if (!zoneDetails) {
      setDeliveryDetails(null);
      showErrorModal(
        "Out of Delivery Zone",
        `This location is ${distance.toFixed(2)} km away. We only deliver within ${MAX_DELIVERY_DISTANCE} km of our store.`
      );
    } else {
      setDeliveryDetails(zoneDetails);
    }
  };

  const handleLocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setCurrentLocation({ lat: latitude, lng: longitude });

    // Reverse geocode to get address
    reverseGeocode(latitude, longitude);
    updateMapLocation(latitude, longitude);
    setLocationFetchedViaGPS(true);
  };

  const handleLocationError = () => {
    // Fallback to geocoding user input address
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
    // Reverse geocode the new position
    reverseGeocode(lat, lng);
  };

  const getDeliveryZoneName = () => {
    if (!deliveryDetails) return "Outside Delivery Zone";

    const distance = calculateDistance(
      STORE_LOCATION.lat,
      STORE_LOCATION.lng,
      currentLocation?.lat || markerPos.lat,
      currentLocation?.lng || markerPos.lng
    );

    if (distance <= 5) return "Zone A";
    if (distance <= 8) return "Zone B";
    if (distance <= 14) return "Zone C";
    if (distance <= 17) return "Zone D";
    if (distance <= 20) return "Zone E";
    return "Outside Delivery Zone";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check ordering time first
    if (!isOrderingTime) {
      showErrorModal(
        "Ordering Currently Closed",
        `Orders are only accepted from 2:00 PM to 10:00 PM (Pakistan Time). Please place your order during our business hours. Next ordering time: ${nextOrderingTime}`
      );
      return;
    }

    if (!meetsMinimumOrder) {
      showErrorModal(
        "Minimum Order Required",
        `Your order total must be at least Rs. ${MINIMUM_ORDER_AMOUNT.toLocaleString()}. Please add more items to your cart.`
      );
      return;
    }

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
      userInputAddress, // First address - as entered by user
      resolvedAddress, // Second address - resolved/location based
      coordinates: currentLocation || markerPos,
      cookies: cartItems,
      deliveryZone: getDeliveryZoneName(),
      deliveryCharges,
      totalPrice: total,
      estimatedDeliveryTime: deliveryDetails?.eta || "N/A",
      additionalRecommendations: formData.get("recommendations"),
      orderTime: new Date().toLocaleString("en-US", { timeZone: PAKISTAN_TIMEZONE }),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (result.success) {
        router.push(`/thank-you?eta=${encodeURIComponent(deliveryDetails.eta)}`);
        resetQuantities();
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
    <div className="min-h-screen w-full">
      <ErrorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white pt-6">Checkout</h1>

        <div className="max-w-6xl mx-auto pb-10">
          {/* Mobile Layout - Order Summary First */}
          <div className="lg:hidden space-y-6">
            {/* ORDER SUMMARY - Mobile First */}
            <div className="w-full">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                deliveryCharges={deliveryCharges}
                total={total}
                isWithinRange={isWithinRange}
                deliveryDetails={deliveryDetails}
                meetsMinimumOrder={meetsMinimumOrder}
                minimumOrderAmount={MINIMUM_ORDER_AMOUNT}
              />
            </div>

            {/* FORM - Mobile Second */}
            <div className="w-full">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                {/* Ordering Hours Status */}
                <div className={`mb-6 p-4 rounded-lg border ${isOrderingTime
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                  }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-3 h-3 rounded-full ${isOrderingTime ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                    <h3 className={`font-medium ${isOrderingTime ? 'text-green-800' : 'text-red-800'
                      }`}>
                      {isOrderingTime ? '🟢 Orders Open' : '🔴 Orders Closed'}
                    </h3>
                  </div>
                  <div className={`text-sm ${isOrderingTime ? 'text-green-700' : 'text-red-700'
                    }`}>
                    <p><strong>Current Time (Pakistan):</strong> {currentTime}</p>
                    <p><strong>Ordering Hours:</strong> 1:00 PM - 11:00 PM (Pakistan Time)</p>
                    {!isOrderingTime && (
                      <p><strong>Next Available:</strong> {nextOrderingTime}</p>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Information */}
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
                        disabled={!isOrderingTime}
                        className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        disabled={!isOrderingTime}
                        className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        disabled={!isOrderingTime}
                        className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Payment Method</h2>
                    <div className={`border border-gray-300 rounded-md p-4 ${isOrderingTime ? 'bg-gray-50' : 'bg-gray-100'
                      }`}>
                      <label className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked
                          readOnly
                          disabled={!isOrderingTime}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">Cash on Delivery</span>
                      </label>
                    </div>
                  </div>

                  {/* Location Services */}
                  {isOrderingTime && (
                    <LocationService
                      onLocationSuccess={handleLocationSuccess}
                      onLocationError={handleLocationError}
                    />
                  )}

                  {/* Address Form */}
                  <AddressForm
                    userInputAddress={userInputAddress}
                    setUserInputAddress={setUserInputAddress}
                    resolvedAddress={resolvedAddress}
                    onGeocodeAddress={handleGeocodeUserAddress}
                    isProcessing={isProcessing}
                    isLocationFromGPS={locationFetchedViaGPS}
                    disabled={!isOrderingTime}
                  />

                  {/* Minimum Order Notice */}
                  {!meetsMinimumOrder && (
                    <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                      <h3 className="font-medium text-orange-800 mb-2">⚠️ Minimum Order Required</h3>
                      <p className="text-sm text-orange-700">
                        Minimum order amount is Rs. {MINIMUM_ORDER_AMOUNT.toLocaleString()}.
                        You need Rs. {(MINIMUM_ORDER_AMOUNT - subtotal).toLocaleString()} more to place this order.
                      </p>
                    </div>
                  )}

                  {/* Delivery Zone Info */}
                  {deliveryDetails && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <h3 className="font-medium text-green-800 mb-2">Delivery Information</h3>
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Zone:</strong> {getDeliveryZoneName()}</p>
                        <p><strong>Delivery Charge:</strong> Rs. {deliveryDetails.charge}</p>
                        <p><strong>Estimated Time:</strong> {deliveryDetails.eta}</p>
                      </div>
                    </div>
                  )}

                  {/* Map */}
                  {/* {isOrderingTime && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-700">Delivery Location</h3>
                      <div className="h-[250px] sm:h-[300px] w-full border border-gray-300 rounded-md overflow-hidden">
                        <Map
                          key={mapKey}
                          center={mapCenter}
                          markerPos={markerPos}
                          storeLocation={STORE_LOCATION}
                          deliveryRadius={MAX_DELIVERY_DISTANCE}
                          onMarkerDrag={handleMapMarkerDrag}
                          draggable={true}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        💡 You can drag the marker to adjust your exact location
                      </p>
                    </div>
                  )} */}

                  {/* Additional Notes */}
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Additional Recommendations (optional)
                    </label>
                    <textarea
                      name="recommendations"
                      rows="3"
                      disabled={!isOrderingTime}
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Any special instructions for your order..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!isOrderingTime || !isWithinRange || !meetsMinimumOrder || isProcessing}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                  >
                    {isProcessing ? "Processing..." :
                      !isOrderingTime ? "Ordering Closed" : "Place Order"}
                  </button>

                  {/* Order Requirements Status */}
                  {(!meetsMinimumOrder || !isWithinRange || !isOrderingTime) && (
                    <div className="text-sm text-gray-600 text-center">
                      {!isOrderingTime && "✗ Orders only accepted 2:00 PM - 10:00 PM (Pakistan Time)"}
                      {isOrderingTime && !meetsMinimumOrder && !isWithinRange && (
                        "✗ Minimum order amount and delivery location required"
                      )}
                      {isOrderingTime && !meetsMinimumOrder && isWithinRange && (
                        "✗ Minimum order amount required"
                      )}
                      {isOrderingTime && meetsMinimumOrder && !isWithinRange && (
                        "✗ Valid delivery location required"
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original Order */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
            {/* LEFT - FORM */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* Ordering Hours Status */}
              <div className={`mb-6 p-4 rounded-lg border ${isOrderingTime
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
                }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-3 h-3 rounded-full ${isOrderingTime ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                  <h3 className={`font-medium ${isOrderingTime ? 'text-green-800' : 'text-red-800'
                    }`}>
                    {isOrderingTime ? '🟢 Orders Open' : '🔴 Orders Closed'}
                  </h3>
                </div>
                <div className={`text-sm ${isOrderingTime ? 'text-green-700' : 'text-red-700'
                  }`}>
                  <p><strong>Current Time (Pakistan):</strong> {currentTime}</p>
                  <p><strong>Ordering Hours:</strong> 2:00 PM - 10:00 PM (Pakistan Time)</p>
                  {!isOrderingTime && (
                    <p><strong>Next Available:</strong> {nextOrderingTime}</p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
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
                      disabled={!isOrderingTime}
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                      disabled={!isOrderingTime}
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                      disabled={!isOrderingTime}
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Payment Method</h2>
                  <div className={`border border-gray-300 rounded-md p-4 ${isOrderingTime ? 'bg-gray-50' : 'bg-gray-100'
                    }`}>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked
                        readOnly
                        disabled={!isOrderingTime}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Location Services */}
                {isOrderingTime && (
                  <LocationService
                    onLocationSuccess={handleLocationSuccess}
                    onLocationError={handleLocationError}
                  />
                )}

                {/* Address Form */}
                <AddressForm
                  userInputAddress={userInputAddress}
                  setUserInputAddress={setUserInputAddress}
                  resolvedAddress={resolvedAddress}
                  onGeocodeAddress={handleGeocodeUserAddress}
                  isProcessing={isProcessing}
                  isLocationFromGPS={locationFetchedViaGPS}
                  disabled={!isOrderingTime}
                />

                {/* Minimum Order Notice */}
                {!meetsMinimumOrder && (
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                    <h3 className="font-medium text-orange-800 mb-2">⚠️ Minimum Order Required</h3>
                    <p className="text-sm text-orange-700">
                      Minimum order amount is Rs. {MINIMUM_ORDER_AMOUNT.toLocaleString()}.
                      You need Rs. {(MINIMUM_ORDER_AMOUNT - subtotal).toLocaleString()} more to place this order.
                    </p>
                  </div>
                )}

                {/* Delivery Zone Info */}
                {deliveryDetails && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h3 className="font-medium text-green-800 mb-2">Delivery Information</h3>
                    <div className="text-sm text-green-700 space-y-1">
                      <p><strong>Zone:</strong> {getDeliveryZoneName()}</p>
                      <p><strong>Delivery Charge:</strong> Rs. {deliveryDetails.charge}</p>
                      <p><strong>Estimated Time:</strong> {deliveryDetails.eta}</p>
                    </div>
                  </div>
                )}

                {/* Map */}
                {/* {isOrderingTime && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Delivery Location</h3>
                    <div className="h-[300px] w-full border border-gray-300 rounded-md overflow-hidden">
                      <Map
                        key={mapKey}
                        center={mapCenter}
                        markerPos={markerPos}
                        storeLocation={STORE_LOCATION}
                        deliveryRadius={MAX_DELIVERY_DISTANCE}
                        onMarkerDrag={handleMapMarkerDrag}
                        draggable={true}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      💡 You can drag the marker to adjust your exact location
                    </p>
                  </div>
                )} */}

                {/* Additional Notes */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Additional Recommendations (optional)
                  </label>
                  <textarea
                    name="recommendations"
                    rows="3"
                    disabled={!isOrderingTime}
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isOrderingTime || !isWithinRange || !meetsMinimumOrder || isProcessing}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  {isProcessing ? "Processing..." :
                    !isOrderingTime ? "Ordering Closed" : "Place Order"}
                </button>

                {/* Order Requirements Status */}
                {(!meetsMinimumOrder || !isWithinRange || !isOrderingTime) && (
                  <div className="text-sm text-gray-600 text-center">
                    {!isOrderingTime && "✗ Orders only accepted 2:00 PM - 10:00 PM (Pakistan Time)"}
                    {isOrderingTime && !meetsMinimumOrder && !isWithinRange && (
                      "✗ Minimum order amount and delivery location required"
                    )}
                    {isOrderingTime && !meetsMinimumOrder && isWithinRange && (
                      "✗ Minimum order amount required"
                    )}
                    {isOrderingTime && meetsMinimumOrder && !isWithinRange && (
                      "✗ Valid delivery location required"
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* RIGHT - ORDER SUMMARY */}
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              deliveryCharges={deliveryCharges}
              total={total}
              isWithinRange={isWithinRange}
              deliveryDetails={deliveryDetails}
              meetsMinimumOrder={meetsMinimumOrder}
              minimumOrderAmount={MINIMUM_ORDER_AMOUNT}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;