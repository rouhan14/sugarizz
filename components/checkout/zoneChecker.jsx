"use client";

import { useEffect } from "react";
import deliveryZones from "./zoneData";
import { findMatchingZone } from "@/utils/polygonUtils";

const ZoneChecker = ({ lat, lng, onZoneFound, onZoneNotFound }) => {
  useEffect(() => {
    if (!lat || !lng) return;

    const zone = findMatchingZone(lat, lng, deliveryZones);
    if (zone) {
      onZoneFound(zone);
    } else {
      onZoneNotFound();
    }
  }, [lat, lng]);

  return null;
};

export default ZoneChecker;
