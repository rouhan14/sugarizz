"use client";

import { useEffect, useCallback } from "react";
import { calculateDistanceAndDelivery } from "@/utils/locationUtils";
import { getDeliveryDetails } from "@/utils/getDeliveryDetails";

/**
 * Distance-based delivery zone checker using Google Distance Matrix API
 * This replaces the old circle-based system with actual road distance
 */
const DistanceZoneChecker = ({ 
  lat, 
  lng, 
  address,
  onZoneFound, 
  onZoneNotFound,
  onProcessing // Optional callback for loading states
}) => {
  // Memoize the zone checking logic
  const checkZone = useCallback(async () => {
    if ((!lat || !lng) && !address) return;

    // Notify parent that we're processing if callback provided
    if (onProcessing) onProcessing(true);

    try {
      // Calculate distance using Distance Matrix API
      const result = await calculateDistanceAndDelivery(address, lat, lng, !address);
      
      if (!result.success) {
        console.error("Distance calculation failed:", result.message);
        onZoneNotFound();
        return;
      }

      const roadDistanceKm = result.distance.km;
      console.log(`🛣️ Road distance to store: ${roadDistanceKm} km`);
      
      // Get delivery zone based on road distance
      const deliveryZone = getDeliveryDetails(roadDistanceKm);
      
      if (deliveryZone) {
        onZoneFound({
          ...deliveryZone,
          distanceFromStore: roadDistanceKm,
          duration: result.duration,
          coordinates: result.coordinates,
          resolvedAddress: result.address
        });
      } else {
        console.log("❌ Location outside delivery zones");
        onZoneNotFound();
      }
    } catch (error) {
      console.error("Error checking delivery zone:", error);
      onZoneNotFound();
    } finally {
      // Notify parent that we're done processing if callback provided
      if (onProcessing) onProcessing(false);
    }
  }, [lat, lng, address, onZoneFound, onZoneNotFound, onProcessing]);

  useEffect(() => {
    checkZone();
  }, [checkZone]);

  return null;
};

export default DistanceZoneChecker;
