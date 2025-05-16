"use client";

import React, { useState, useEffect } from "react";
import { drawCircleWithImage } from "@/utils/maps/markerUtils";
import { Marker } from "@react-google-maps/api";
import { BasePin } from "@/app/places/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface CustomMarkerProps {
  data: BasePin;
  onClick: () => void;
  isSelected: boolean;
}

const markerIconCache = new Map<string, google.maps.Icon>();

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const CustomMarker: React.FC<CustomMarkerProps> = ({ data, onClick, isSelected }) => {
  const [icon, setIcon] = useState<google.maps.Icon | null>(null);
  const displaySize = isSelected ? 80 : 56;

  useEffect(() => {
    (async () => {
      if (markerIconCache.has(data.id)) {
        setIcon(markerIconCache.get(data.id)!);
        return;
      }

      const scale = 2;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;

      const canvasWidth = displaySize * scale;
      const canvasHeight = displaySize * scale;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      context.scale(scale, scale);

      try {
        const centerX = displaySize / 2;
        const centerY = displaySize / 2;
        const mainRadius = displaySize / 2 - 2;
        const smallRadius = mainRadius * 0.4;
        const smallX = centerX + mainRadius * 0.5;
        const smallY = centerY + mainRadius * 0.5;

        const mainImg = await loadImage(data.image);
        await drawCircleWithImage(context, mainImg, centerX, centerY, mainRadius, true);

        const userImg = await loadImage(data.host.image || PLACEHOLDER_IMAGE);
        await drawCircleWithImage(context, userImg, smallX, smallY, smallRadius, false);

        const markerIcon: google.maps.Icon = {
          url: canvas.toDataURL("image/png", 1.0),
          scaledSize: new google.maps.Size(displaySize, displaySize),
          anchor: new google.maps.Point(displaySize / 2, displaySize / 2),
        };

        markerIconCache.set(data.id, markerIcon);
        setIcon(markerIcon);
      } catch (error) {
        console.warn("Failed to create marker icon:", error);
      }
    })();
  }, [data.id, data.image, data.host.image, displaySize]);

  if (!icon) return null;

  return (
    <Marker
      position={{ lat: data.latitude, lng: data.longitude }}
      icon={icon}
      onClick={onClick}
      zIndex={isSelected ? 2 : 1}
      title={data.host.name}
    />
  );
};

export default CustomMarker;
