"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Marker } from "@react-google-maps/api";
import { IPlacePin } from "@/app/places/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";

const NORMAL_SIZE = 48;
const SELECTED_SIZE = 70; // Match the original implementation size

interface NextImageMarkerProps {
  data: IPlacePin;
  onClick: () => void;
  isSelected: boolean;
}

const markerIconCache = new Map<string, google.maps.Icon>();

const NextImageMarker: React.FC<NextImageMarkerProps> = ({
  data,
  onClick,
  isSelected,
}) => {
  const [icon, setIcon] = useState<google.maps.Icon | null>(null);
  const displaySize = isSelected ? SELECTED_SIZE : NORMAL_SIZE;
  
  const hostImage = useMemo(() => data.host.image ?? PLACEHOLDER_IMAGE, [data.host.image]);
  const mainImage = useMemo(() => data.image ?? PLACEHOLDER_IMAGE, [data.image]);
  
  const cacheKey = `${data.id}-${isSelected ? 'selected' : 'normal'}`;

  useEffect(() => {
    let isMounted = true;

    const createMarkerIcon = async () => {
      if (markerIconCache.has(cacheKey)) {
        isMounted && setIcon(markerIconCache.get(cacheKey)!);
        return;
      }

      const markerIcon = {
        url: mainImage,
        scaledSize: new google.maps.Size(displaySize, displaySize),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(displaySize / 2, displaySize / 2 + (isSelected ? 110 : 0)),
      };

      markerIconCache.set(cacheKey, markerIcon);
      isMounted && setIcon(markerIcon);
    };

    createMarkerIcon();

    return () => {
      isMounted = false;
    };
  }, [cacheKey, mainImage, hostImage, displaySize, isSelected, data.id]);

  if (!icon) {
    return null;
  }

  return (
    <Marker
      position={{ lat: data.latitude, lng: data.longitude }}
      onClick={onClick}
      icon={icon}
      zIndex={isSelected ? 2 : 1}
      title={data.host.name}
    />
  );
};

export default NextImageMarker;
