"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import L from "leaflet";
import { CIRCLE_CENTERS, CIRCLE_RADIUS } from "@/data/circleData";

// Dynamically import Leaflet components (to avoid SSR errors)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then(mod => mod.Circle), { ssr: false });

const storeIcon = L.icon({
  iconUrl: "/store-marker.png", // Different icon for store
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowUrl: "/marker-shadow.png",
  shadowSize: [41, 41],
});

const userIcon = L.icon({
  iconUrl: "/user-marker.png", // Different icon for user
  iconSize: [25, 35],
  iconAnchor: [12, 35],
  popupAnchor: [1, -34],
  shadowUrl: "/marker-shadow.png",
  shadowSize: [35, 35],
});

// Fallback icon if custom icons don't exist
const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/marker-shadow.png",
  shadowSize: [41, 41],
});

const CircleDeliveryMap = ({ userPos, storePos }) => {
  const center = userPos || storePos;

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-6 z-0">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Store Marker */}
        <Marker 
          position={[storePos.lat, storePos.lng]} 
          icon={storeIcon}
          title="Store Location"
        />

        {/* User Marker */}
        {userPos && (
          <Marker 
            position={[userPos.lat, userPos.lng]} 
            icon={userIcon}
            title="Your Location"
          />
        )}

        {/* Delivery Circles */}
        {CIRCLE_CENTERS.map((circle, idx) => (
          <Circle
            key={idx}
            center={[circle.lat, circle.lng]}
            radius={CIRCLE_RADIUS * 1000} // Convert km to meters
            pathOptions={{ 
              color: "#10B981", 
              fillColor: "#10B981",
              fillOpacity: 0.1,
              weight: 2,
              opacity: 0.8
            }}
          />
        ))}

        {/* Circle Center Markers (optional, for visualization) */}
        {CIRCLE_CENTERS.map((circle, idx) => (
          <Marker
            key={`center-${idx}`}
            position={[circle.lat, circle.lng]}
            icon={defaultIcon}
            title={`Delivery Circle ${circle.id}`}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default CircleDeliveryMap;