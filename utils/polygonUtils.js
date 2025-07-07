import { point, polygon, booleanPointInPolygon } from "@turf/turf";

export function findMatchingZone(lat, lng, zones) {
  const userPoint = point([lng, lat]);

  for (const zone of zones) {
    const poly = polygon([[...zone.polygon]]);
    if (booleanPointInPolygon(userPoint, poly)) {
      return zone;
    }
  }

  return null; // no match
}
