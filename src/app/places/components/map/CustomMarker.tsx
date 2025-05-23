"use client";

import React, { useEffect, useMemo, useState } from "react";
import { drawCircleWithImage } from "@/utils/maps/markerUtils";
import { Marker } from "@react-google-maps/api";
import { IPlacePin } from "@/app/places/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface CustomMarkerProps {
  data: IPlacePin;
  onClick: () => void;
  isSelected: boolean;
}

const markerIconCache = new Map<string, google.maps.Icon>();

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const setupCanvas = (size: number, includeShadowPadding: boolean = false) => {
  const scale = 2;
  const shadowPadding = includeShadowPadding ? 24 : 0;
  const totalSize = size + shadowPadding;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Failed to get canvas context");

  canvas.width = totalSize * scale;
  canvas.height = totalSize * scale;

  context.scale(scale, scale);

  if (includeShadowPadding) {
    context.translate(shadowPadding / 2, shadowPadding / 2);
  }

  return { canvas, context, totalSize, shadowPadding };
};

const createIconObject = (
  canvas: HTMLCanvasElement,
  size: number,
  shadowPadding: number,
  anchorYOffset: number = 0,
): google.maps.Icon => {
  const totalSize = size + shadowPadding;
  return {
    url: canvas.toDataURL("image/png", 1.0),
    scaledSize: new google.maps.Size(totalSize, totalSize),
    anchor: new google.maps.Point(totalSize / 2, totalSize / 2 + anchorYOffset),
  };
};

const createPlaceholderIcon = async (size: number): Promise<google.maps.Icon> => {
  const { canvas, context, totalSize } = setupCanvas(size);

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 2;

  const placeholderImage = await loadImage(PLACEHOLDER_IMAGE);
  await drawCircleWithImage(context, placeholderImage, centerX, centerY, radius, true);

  return createIconObject(canvas, size, 0, 10);
};

const CustomMarker: React.FC<CustomMarkerProps> = ({ data, onClick, isSelected }) => {
  const [icon, setIcon] = useState<google.maps.Icon | null>(null);
  const displaySize = isSelected ? 70 : 48;

  // ✅ 安定した依存値にする（nullを避ける）
  const hostImage = useMemo(() => data.host.image ?? PLACEHOLDER_IMAGE, [data.host.image]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (markerIconCache.has(data.id)) {
        isMounted && setIcon(markerIconCache.get(data.id)!);
        return;
      }

      try {
        const placeholder = await createPlaceholderIcon(displaySize);
        isMounted && setIcon(placeholder);
      } catch (error) {
        console.warn("Failed to create placeholder icon:", error);
      }

      const { canvas, context, totalSize, shadowPadding } = setupCanvas(displaySize, true);

      try {
        const centerX = displaySize / 2;
        const centerY = displaySize / 2;
        const mainRadius = displaySize / 2 - 2;
        const smallRadius = mainRadius * 0.4;
        const smallX = centerX + mainRadius * 0.5;
        const smallY = centerY + mainRadius * 0.5;

        const mainImg = await loadImage(data.image);
        await drawCircleWithImage(context, mainImg, centerX, centerY, mainRadius, true);

        const userImg = await loadImage(hostImage);
        await drawCircleWithImage(context, userImg, smallX, smallY, smallRadius, false);

        const markerIcon = createIconObject(
          canvas,
          displaySize,
          shadowPadding,
          isSelected ? 110 : 0,
        );

        markerIconCache.set(data.id, markerIcon);
        isMounted && setIcon(markerIcon);
      } catch (error) {
        console.warn("Failed to create marker icon:", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [data.id, data.image, hostImage, displaySize, isSelected]);

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
