// utils/getDeliveryDetails.js
import { DELIVERY_ZONES } from './deliveryZones';

export function getDeliveryDetails(distanceKm) {
  for (const zone of DELIVERY_ZONES) {
    if (distanceKm <= zone.maxDistance) {
      return zone;
    }
  }
  return null; // outside all zones
}