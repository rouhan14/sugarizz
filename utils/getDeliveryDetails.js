// utils/getDeliveryDetails.js - Updated for Distance Matrix API
import { DELIVERY_ZONES } from './deliveryZones';

export function getDeliveryDetails(distanceKm) {
  for (const zone of DELIVERY_ZONES) {
    if (distanceKm <= zone.maxDistance) {
      return {
        ...zone,
        name: getZoneName(distanceKm)
      };
    }
  }
  return null; // outside all zones
}

// Helper function to get zone name based on road distance
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
