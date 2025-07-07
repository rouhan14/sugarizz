// utils/circleUtils.js
import { CIRCLE_CENTERS, CIRCLE_RADIUS } from '@/data/circleData';

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Check if a point is within any of the delivery circles
export const isWithinDeliveryCircles = (userLat, userLng) => {
  for (const circle of CIRCLE_CENTERS) {
    const distance = calculateDistance(userLat, userLng, circle.lat, circle.lng);
    if (distance <= CIRCLE_RADIUS) {
      return true;
    }
  }
  return false;
};

// Get all circles that contain the user's location
export const getMatchingCircles = (userLat, userLng) => {
  const matchingCircles = [];
  
  for (const circle of CIRCLE_CENTERS) {
    const distance = calculateDistance(userLat, userLng, circle.lat, circle.lng);
    if (distance <= CIRCLE_RADIUS) {
      matchingCircles.push({
        ...circle,
        distanceFromCircleCenter: distance
      });
    }
  }
  
  return matchingCircles;
};