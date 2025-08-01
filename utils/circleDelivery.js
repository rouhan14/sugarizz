"use client";

import { useEffect, useCallback } from "react";
import { isWithinDeliveryCircles, calculateDistance } from "@/utils/circleUtils";
import { getDeliveryZoneByDistance } from "@/utils/deliveryZones";

const CircleZoneChecker = ({ 
  lat, 
  lng, 
  storeLocation, 
  onZoneFound, 
  onZoneNotFound 
}) => {
  // Memoize the zone checking logic
  const checkZone = useCallback(() => {
    if (!lat || !lng) return;

    // Check if user location is within any delivery circle
    const isWithinCircles = isWithinDeliveryCircles(lat, lng);
    
    if (isWithinCircles) {
      // Calculate distance from store location
      const distanceFromStore = calculateDistance(
        lat, 
        lng, 
        storeLocation.lat, 
        storeLocation.lng
      );
      
      // Get delivery zone based on distance from store
      const deliveryZone = getDeliveryZoneByDistance(distanceFromStore);
      
      if (deliveryZone) {
        onZoneFound({
          ...deliveryZone,
          distanceFromStore,
          name: getZoneName(distanceFromStore)
        });
      } else {
        onZoneNotFound();
      }
    } else {
      onZoneNotFound();
    }
  }, [lat, lng, storeLocation.lat, storeLocation.lng, onZoneFound, onZoneNotFound]);

  useEffect(() => {
    checkZone();
  }, [checkZone]);

  return null;
};

// Helper function to get zone name based on distance
const getZoneName = (distance) => {
  if (distance <= 5) return "Zone A";
  if (distance <= 8) return "Zone B";
  if (distance <= 14) return "Zone C";
  if (distance <= 17) return "Zone D";
  if (distance <= 20) return "Zone E";
  if (distance <= 23) return "Zone F";
  if (distance <= 26) return "Zone G";
  if (distance <= 29) return "Zone H";
  return "Outside Delivery Zone";
};

export default CircleZoneChecker;