"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import L from "leaflet";
import deliveryZones from "./zoneData";

// Dynamically import Leaflet components (to avoid SSR errors)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then(mod => mod.Polygon), { ssr: false });

const icon = L.icon({
  iconUrl: "/marker-icon.png", // Make sure to have this in public folder or use another
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "/marker-shadow.png",
  shadowSize: [41, 41],
});

const DeliveryZoneMap = ({ userPos, storePos }) => {
  const center = userPos || storePos;

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-6 z-0">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Store Marker */}
        <Marker position={[storePos.lat, storePos.lng]} icon={icon} />

        {/* User Marker */}
        {userPos && <Marker position={[userPos.lat, userPos.lng]} icon={icon} />}

        {/* Delivery Zones */}
        {deliveryZones.map((zone, idx) => (
          <Polygon
            key={idx}
            positions={zone.polygon.map(([lng, lat]) => [lat, lng])} // Flip [lng, lat] to [lat, lng]
            pathOptions={{ color: "lime", fillOpacity: 0.2 }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default DeliveryZoneMap;
