// utils/deliveryZones.js
export const DELIVERY_ZONES = [
  { maxDistance: 5, charge: 100, eta: "60–90 minutes" },
  { maxDistance: 8, charge: 150, eta: "90–105 minutes" },
  { maxDistance: 14, charge: 250, eta: "120–135 minutes" },
  { maxDistance: 17, charge: 300, eta: "135–150 minutes" },
  { maxDistance: 20, charge: 350, eta: "150–165 minutes" },
];

export const getDeliveryZoneByDistance = (distance) => {
  for (const zone of DELIVERY_ZONES) {
    if (distance <= zone.maxDistance) {
      return zone;
    }
  }
  return null; // Outside delivery range
};