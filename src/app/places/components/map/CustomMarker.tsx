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

const createPlaceholderIcon = async (size: number): Promise<google.maps.Icon> => {
  const scale = 2;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const canvasSize = size * scale;

  canvas.width = canvasSize;
  canvas.height = canvasSize;

  if (!context) throw new Error("Failed to get canvas context");
  context.scale(scale, scale);

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 2;

  const placeholderImage = await loadImage(PLACEHOLDER_IMAGE);
  await drawCircleWithImage(context, placeholderImage, centerX, centerY, radius, true);

  return {
    url: canvas.toDataURL("image/png"),
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size / 2 + 10),
  };
};

const CustomMarker: React.FC<CustomMarkerProps> = ({ data, onClick, isSelected }) => {
  const [icon, setIcon] = useState<google.maps.Icon | null>(null);
  const displaySize = isSelected ? 80 : 56;

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (markerIconCache.has(data.id)) {
        isMounted && setIcon(markerIconCache.get(data.id)!);
        return;
      }

      // 一旦プレースホルダーを先に表示
      try {
        const placeholder = await createPlaceholderIcon(displaySize);
        isMounted && setIcon(placeholder);
      } catch (error) {
        console.warn("Failed to create placeholder icon:", error);
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
          anchor: new google.maps.Point(displaySize / 2, displaySize / 2 + (isSelected ? 65 : 0)),
        };

        markerIconCache.set(data.id, markerIcon);
        isMounted && setIcon(markerIcon);
      } catch (error) {
        console.warn("Failed to create marker icon:", error);
      }
    })();

    return () => {
      isMounted = false;
    };
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
