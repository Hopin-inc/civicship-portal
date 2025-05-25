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
    img.onerror = (e) => {
      console.warn(`Failed to load image from ${src}:`, e);
      // Try without crossOrigin as a fallback
      if (img.crossOrigin) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = reject;
        fallbackImg.src = src;
      } else {
        reject(e);
      }
    };
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
  try {
    const { canvas, context, totalSize } = setupCanvas(size);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 2;

    const placeholderImage = await loadImage(PLACEHOLDER_IMAGE);
    await drawCircleWithImage(context, placeholderImage, centerX, centerY, radius, true);

    return createIconObject(canvas, size, 0, 10);
  } catch (error) {
    console.warn("Failed to create placeholder icon, using direct URL:", error);
    // Fallback to direct URL approach when Canvas fails
    return {
      url: PLACEHOLDER_IMAGE,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size / 2, size / 2 + 10),
    };
  }
};

const CustomMarker: React.FC<CustomMarkerProps> = ({ data, onClick, isSelected }) => {
  const [icon, setIcon] = useState<google.maps.Icon | null>(null);
  const displaySize = isSelected ? 70 : 48;
  const cacheKey = `${data.id}-${isSelected ? "selected" : "normal"}`;

  // ✅ 安定した依存値にする（nullを避ける）
  const hostImage = useMemo(() => data.host.image ?? PLACEHOLDER_IMAGE, [data.host.image]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (markerIconCache.has(cacheKey)) {
        isMounted && setIcon(markerIconCache.get(cacheKey)!);
        return;
      }

      try {
        const placeholder = await createPlaceholderIcon(displaySize);
        isMounted && setIcon(placeholder);
      } catch (error) {
        console.warn("Failed to create placeholder icon:", error);
      }

      try {
        const { canvas, context, totalSize, shadowPadding } = setupCanvas(displaySize, true);

        const centerX = displaySize / 2;
        const centerY = displaySize / 2;
        const mainRadius = displaySize / 2 - 2;
        const smallRadius = mainRadius * 0.4;
        const smallX = centerX + mainRadius * 0.5;
        const smallY = centerY + mainRadius * 0.5;

        const mainImg = await loadImage(data.image);
        await drawCircleWithImage(context, mainImg, centerX, centerY, mainRadius, true);

        // ホスト画像の描画がうまくいかず、一時コメントアウト
        // const userImg = await loadImage(hostImage);
        // await drawCircleWithImage(context, userImg, smallX, smallY, smallRadius, false);

        const markerIcon = createIconObject(
          canvas,
          displaySize,
          shadowPadding,
          isSelected ? 110 : 0,
        );

        markerIconCache.set(cacheKey, markerIcon);
        isMounted && setIcon(markerIcon);
      } catch (error) {
        console.warn(
          "Failed to create marker icon with Canvas, falling back to direct URL:",
          error,
        );

        // Fallback to direct URL approach when Canvas fails
        const fallbackIcon = {
          url: data.image || PLACEHOLDER_IMAGE,
          scaledSize: new google.maps.Size(displaySize, displaySize),
          anchor: new google.maps.Point(displaySize / 2, displaySize / 2 + (isSelected ? 110 : 0)),
        };

        markerIconCache.set(cacheKey, fallbackIcon);
        isMounted && setIcon(fallbackIcon);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [data.id, data.image, hostImage, displaySize, isSelected, cacheKey]);

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
