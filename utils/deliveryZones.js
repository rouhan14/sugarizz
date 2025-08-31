// utils/deliveryZones.js
export const DELIVERY_ZONES = [
  { maxDistance: 7, charge: 100, eta: "60–90 minutes" },
  { maxDistance: 11, charge: 150, eta: "60–90 minutes" },
  { maxDistance: 17, charge: 250, eta: "90–120 minutes" },
  { maxDistance: 20, charge: 300, eta: "120–135 minutes" },
  { maxDistance: 23, charge: 350, eta: "135–150 minutes" },
  { maxDistance: 26, charge: 400, eta: "150–165 minutes" },
  { maxDistance: 29, charge: 450, eta: "165–180 minutes" },
  { maxDistance: 31, charge: 500, eta: "165–180 minutes" },
];

export const getDeliveryZoneByDistance = (distance) => {
  for (const zone of DELIVERY_ZONES) {
    if (distance <= zone.maxDistance) {
      return zone;
    }
  }
  return null; // Outside delivery range
};