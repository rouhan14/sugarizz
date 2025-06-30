import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ center, markerPos, storeLocation, deliveryRadius }) => {
  const mapRef = useRef();

  useEffect(() => {
    // Force map to resize after it's loaded
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [center]);

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', minHeight: '300px' }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
        // Ensure proper sizing
        setTimeout(() => {
          mapInstance.invalidateSize();
        }, 100);
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <Marker position={markerPos} />
      <Circle
        center={storeLocation}
        radius={deliveryRadius * 1000}
        pathOptions={{ 
          fillColor: "green", 
          fillOpacity: 0.2, 
          color: "green",
          weight: 2
        }}
      />
    </MapContainer>
  );
};

export default MapComponent;