"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useCookieStore from "@/store/cookieStore";
import data from "@/data";
import ErrorModal from "@/components/errorModal";
import LocationService from "@/components/locationService";
import AddressForm from "@/components/checkout/addressForm";
import OrderSummary from "@/components/orderSummary";
import { geocodeAddress } from "@/utils/locationUtils";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import { useMemo } from "react";

import OrderingStatus from "@/components/checkout/OrderingStatus";
import CustomerInfo from "@/components/checkout/CustomerInfo";
import OrderSummaryExtras from "@/components/checkout/OrderSummaryExtras";
import CircleZoneChecker from "@/utils/circleDelivery";

// Constants
const STORE_LOCATION = { lat: 31.3536, lng: 74.2518 };
const MINIMUM_ORDER_AMOUNT = 1200; // Minimum order amount in Rs.
const ORDERING_START_HOUR = 13; // 1 PM in 24-hour format
const ORDERING_END_HOUR = 23; // 11 PM in 24-hour format
const PAKISTAN_TIMEZONE = 'Asia/Karachi';

const Checkout = () => {
  // Address states
  const [userInputAddress, setUserInputAddress] = useState(""); // First address - user input
  const [resolvedAddress, setResolvedAddress] = useState(""); // Second address - resolved/location
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationFetchedViaGPS, setLocationFetchedViaGPS] = useState(false);

  // Delivery states
  const [deliveryDetails, setDeliveryDetails] = useState(null);

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

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Replace your existing checkOrderingTime function with this:
  const checkOrderingTime = useCallback(() => {
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

    // Check if within ordering hours
    const withinHours = currentHour >= ORDERING_START_HOUR && currentHour < ORDERING_END_HOUR;

    // Only update state if values have changed
    setCurrentTime(prevTime => prevTime !== timeString ? timeString : prevTime);
    setIsOrderingTime(prevOrdering => prevOrdering !== withinHours ? withinHours : prevOrdering);

    // Calculate next ordering time
    if (!withinHours) {
      const nextOrdering = new Date(pakistanTime);
      if (currentHour >= ORDERING_END_HOUR) {
        // After 11 PM, next ordering is tomorrow at 1 PM
        nextOrdering.setDate(nextOrdering.getDate() + 1);
        nextOrdering.setHours(ORDERING_START_HOUR, 0, 0, 0);
      } else {
        // Before 1 PM, next ordering is today at 1 PM
        nextOrdering.setHours(ORDERING_START_HOUR, 0, 0, 0);
      }

      const nextTimeString = nextOrdering.toLocaleString("en-US", {
        timeZone: PAKISTAN_TIMEZONE,
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      setNextOrderingTime(prevNext => prevNext !== nextTimeString ? nextTimeString : prevNext);
    } else {
      // Clear next ordering time when within hours
      setNextOrderingTime(prevNext => prevNext !== "" ? "" : prevNext);
    }
  }, []);

  // Update time every minute
  useEffect(() => {
    checkOrderingTime();
    const interval = setInterval(checkOrderingTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkOrderingTime]); // Now depends on the stable checkOrderingTime function

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

  // Compute discounted price
  const finalPrice = useMemo(() => {
    return paymentMethod === "online" ? subtotal * 0.9 : subtotal;
  }, [paymentMethod, subtotal]);

  // Fallback to null-safe deliveryCharges
  const deliveryCharges = deliveryDetails?.charge ?? 0;

  // Only show total if there's a subtotal > 0
  const total = subtotal > 0 ? finalPrice + deliveryCharges : 0;

  const isWithinRange = !!deliveryDetails;
  const meetsMinimumOrder = subtotal >= MINIMUM_ORDER_AMOUNT;

  const showErrorModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleLocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setCurrentLocation({ lat: latitude, lng: longitude });

    // Reverse geocode to get address
    reverseGeocode(latitude, longitude);
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
        setCurrentLocation({ lat: result.lat, lng: result.lng });
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

  const getDeliveryZoneName = () => {
    if (!deliveryDetails) return "Outside Delivery Zone";
    return deliveryDetails.name;
  };


  const handleZoneFound = useCallback((zone) => {
    setDeliveryDetails(zone);
    console.log("Zone found:", zone);
  }, []);

  const handleZoneNotFound = useCallback(() => {
    setDeliveryDetails(null);
  }, []);

  // 2. Also memoize the activePosition and showZoneChecker
  const activePosition = useMemo(() => currentLocation, [currentLocation]);
  const showZoneChecker = useMemo(() =>
    activePosition && activePosition.lat && activePosition.lng,
    [activePosition]
  );

  // 3. Move STORE_LOCATION outside the component or memoize it
  const STORE_LOCATION = useMemo(() => ({ lat: 31.3536, lng: 74.2518 }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOrderingTime) {
      showErrorModal(
        "Ordering Currently Closed",
        `Orders are only accepted from 1:00 PM to 11:00 PM (Pakistan Time). Please place your order during our business hours. Next ordering time: ${nextOrderingTime}`
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
      showErrorModal(
        "Delivery Zone Error",
        "Please enter an address within our delivery zones."
      );
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
      coordinates: currentLocation,
      cookies: cartItems,
      deliveryZone: getDeliveryZoneName(),
      deliveryCharges,
      totalPrice: total,
      estimatedDeliveryTime: deliveryDetails?.eta || "N/A",
      additionalRecommendations: formData.get("recommendations"),
      orderTime: new Date().toLocaleString("en-US", { timeZone: PAKISTAN_TIMEZONE }),
      paymentMethod,
      eta: deliveryDetails?.eta || "N/A",
      distanceFromStore: deliveryDetails?.distanceFromStore || 0,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (result.success) {
        // Clear cart first
        resetQuantities();

        // Then redirect to thank-you page with search params
        const thankYouUrl = `/thank-you?eta=${encodeURIComponent(orderData.eta)}&paymentMethod=${encodeURIComponent(orderData.paymentMethod)}&totalPrice=${encodeURIComponent(orderData.totalPrice)}`;

        // Use window.location.href as a fallback if router.push fails
        try {
          await router.push(thankYouUrl);
        } catch (routerError) {
          console.error("Router push failed, using window.location:", routerError);
          window.location.href = thankYouUrl;
        }
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

  // Get active position for zone checking
  // const activePosition = currentLocation;
  // const showZoneChecker = activePosition && activePosition.lat && activePosition.lng;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] px-4 py-8">
      <ErrorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />

      {/* Circle Zone Checker Component */}
      {showZoneChecker && (
        <CircleZoneChecker
          lat={activePosition.lat}
          lng={activePosition.lng}
          storeLocation={STORE_LOCATION}
          onZoneFound={handleZoneFound}
          onZoneNotFound={handleZoneNotFound}
        />
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white pt-6">Checkout</h1>

        {/* Mobile Layout - Order Summary First */}
        <div className="lg:hidden space-y-6">
          {/* ORDER SUMMARY - Mobile First */}
          <div className="w-full flex flex-col items-center">
            <OrderSummary
              paymentMethod={paymentMethod}
              cartItems={cartItems}
              subtotal={subtotal}
              finalPrice={finalPrice}
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
            <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl transition-all duration-300">
              {/* Ordering Hours Status */}
              <OrderingStatus
                isOrderingTime={isOrderingTime}
                currentTime={currentTime}
                nextOrderingTime={nextOrderingTime}
              />

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <CustomerInfo isOrderingTime={isOrderingTime} />

                {/* Payment Method */}
                <PaymentMethod
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                  isOrderingTime={isOrderingTime}
                />

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
                <OrderSummaryExtras
                  meetsMinimumOrder={meetsMinimumOrder}
                  MINIMUM_ORDER_AMOUNT={MINIMUM_ORDER_AMOUNT}
                  subtotal={subtotal}
                  deliveryDetails={deliveryDetails}
                  getDeliveryZoneName={getDeliveryZoneName}
                  isOrderingTime={isOrderingTime}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isOrderingTime || !isWithinRange || !meetsMinimumOrder || isProcessing}
                  className={`w-full py-3 px-4 rounded-md text-white font-semibold
                    bg-green-500/70 hover:bg-green-500/40
                    border border-white/20 backdrop-blur-md
                    shadow-[inset_0_0_4px_rgba(255,255,255,0.2),_0_4px_10px_rgba(0,128,0,0.35)]
                    hover:shadow-[inset_0_0_6px_rgba(255,255,255,0.25),_0_6px_14px_rgba(0,128,0,0.45)]
                    transition-all duration-300
                    disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer`}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </button>

                {/* Order Requirements Status */}
                {(!meetsMinimumOrder || !isWithinRange || !isOrderingTime) && (
                  <div className="text-sm text-red-300 text-center">
                    {!isOrderingTime && "✗ Orders only accepted 1:00 PM - 11:00 PM (Pakistan Time)"}
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
        <div className="max-w-6xl mx-auto pb-10">
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
            {/* LEFT - FORM */}
            <div className="w-full max-w-2xl backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 transition-all duration-300">
              {/* Ordering Hours Status */}
              <OrderingStatus
                isOrderingTime={isOrderingTime}
                currentTime={currentTime}
                nextOrderingTime={nextOrderingTime}
              />

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <CustomerInfo isOrderingTime={isOrderingTime} />

                {/* Payment Method */}
                <PaymentMethod
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                  isOrderingTime={isOrderingTime}
                />

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
                <OrderSummaryExtras
                  meetsMinimumOrder={meetsMinimumOrder}
                  MINIMUM_ORDER_AMOUNT={MINIMUM_ORDER_AMOUNT}
                  subtotal={subtotal}
                  deliveryDetails={deliveryDetails}
                  getDeliveryZoneName={getDeliveryZoneName}
                  isOrderingTime={isOrderingTime}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isOrderingTime || !isWithinRange || !meetsMinimumOrder || isProcessing}
                  className={`w-full py-3 px-4 rounded-md text-white font-semibold
                    bg-green-500/70 hover:bg-green-500/40
                    border border-white/20 backdrop-blur-md
                    shadow-[inset_0_0_4px_rgba(255,255,255,0.2),_0_4px_10px_rgba(0,128,0,0.35)]
                    hover:shadow-[inset_0_0_6px_rgba(255,255,255,0.25),_0_6px_14px_rgba(0,128,0,0.45)]
                    transition-all duration-300
                    disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer`}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </button>

                {/* Order Requirements Status */}
                {(!meetsMinimumOrder || !isWithinRange || !isOrderingTime) && (
                  <div className="text-sm text-red-300 text-center">
                    {!isOrderingTime && "✗ Orders only accepted 1:00 PM - 11:00 PM (Pakistan Time)"}
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
              paymentMethod={paymentMethod}
              cartItems={cartItems}
              subtotal={subtotal}
              finalPrice={finalPrice}
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