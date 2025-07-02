import React, { useEffect, useRef } from 'react';

const MapComponent = ({
  center,
  markerPos,
  storeLocation,
  deliveryRadius,
  onMarkerDrag,
  draggable = false
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const storeMarkerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    if (window.google && mapRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Draw delivery radius
      circleRef.current = new window.google.maps.Circle({
        strokeColor: '#0ea5e9',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#0ea5e9',
        fillOpacity: 0.1,
        map: mapInstanceRef.current,
        center: storeLocation,
        radius: deliveryRadius * 1000,
      });

      // Store marker
      storeMarkerRef.current = new window.google.maps.Marker({
        position: storeLocation,
        map: mapInstanceRef.current,
        title: 'SugarRizz Store',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#7c3aed" stroke="#ffffff" stroke-width="3"/>
              <text x="20" y="26" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle">🏪</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      });

      // Delivery marker
      markerRef.current = new window.google.maps.Marker({
        position: markerPos,
        map: mapInstanceRef.current,
        title: draggable ? 'Delivery Location (Drag to adjust)' : 'Delivery Location',
        draggable: draggable,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C12.3 0 6 6.3 6 14c0 10.5 14 26 14 26s14-15.5 14-26c0-7.7-6.3-14-14-14z" fill="#ef4444"/>
              <circle cx="20" cy="14" r="7" fill="white"/>
              <circle cx="20" cy="14" r="4" fill="#ef4444"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40)
        }
      });

      // Draggable marker listener
      if (draggable && onMarkerDrag) {
        markerRef.current.addListener('dragend', (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          onMarkerDrag(lat, lng);
        });
      }

      // Info windows
      const storeInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #7c3aed; font-size: 16px;">🏪 SugarRizz Store</h3>
            <p style="margin: 0; font-size: 14px; color: #374151;">This is our store location</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">We deliver within ${deliveryRadius} km radius</p>
          </div>
        `
      });

      const deliveryInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #ef4444; font-size: 16px;">📍 Delivery Location</h3>
            <p style="margin: 0; font-size: 14px; color: #374151;">Your delivery address</p>
            ${draggable ? '<p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Drag to adjust location</p>' : ''}
          </div>
        `
      });

      storeMarkerRef.current.addListener('click', () => {
        deliveryInfoWindow.close();
        storeInfoWindow.open(mapInstanceRef.current, storeMarkerRef.current);
      });

      markerRef.current.addListener('click', () => {
        storeInfoWindow.close();
        deliveryInfoWindow.open(mapInstanceRef.current, markerRef.current);
      });

      mapInstanceRef.current.addListener('click', () => {
        storeInfoWindow.close();
        deliveryInfoWindow.close();
      });
    }

    // Cleanup on unmount
    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
      if (storeMarkerRef.current) storeMarkerRef.current.setMap(null);
      if (circleRef.current) circleRef.current.setMap(null);
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setCenter(center);
    }
  }, [center]);

  useEffect(() => {
    if (markerRef.current && markerPos) {
      markerRef.current.setPosition(markerPos);
    }
  }, [markerPos]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-md" />

      {/* Map Legend */}
      <div className="absolute top-3 left-3 bg-white rounded-lg shadow-lg p-3 max-w-xs text-xs">
        <h4 className="font-semibold text-gray-800 mb-2">Map Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-600 rounded-full mr-2 flex items-center justify-center text-white text-[10px]">🏪</div>
            <span className="text-gray-700">Store Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-700">Delivery Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-blue-400 rounded-full mr-2"></div>
            <span className="text-gray-700">Delivery Zone ({deliveryRadius} km)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
