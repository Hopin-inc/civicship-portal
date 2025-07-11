"use client";

import React, { useEffect, useMemo, useState } from "react";
import { drawCircleWithImage } from "@/app/places/utils/marker";
import { Marker } from "@react-google-maps/api";
import { IPlacePin } from "@/app/places/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { logger } from "@/lib/logging";

interface CustomMarkerProps {
  data: IPlacePin;
  onClick: () => void;
  isSelected: boolean;
}

const markerIconCache = new Map<string, google.maps.Icon>();

const HARDCODED_COORDINATES: Record<string, google.maps.LatLngLiteral> = {
  cmahstwr4002rs60n6map2wiu: { lat: 34.178142, lng: 133.818358 }, // 大庄屋
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      logger.warn(`Failed to load image from ${src}`, {
        error: e,
        component: "CustomMarker"
      });
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
    logger.warn("Failed to create placeholder icon, using direct URL", {
      error: error instanceof Error ? error.message : String(error),
      component: "CustomMarker"
    });
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
  const displaySize = 48;
  const cacheKey = `${data.id}-normal`;

  // ✅ 安定した依存値にする（nullを避ける）
  const hostImage = useMemo(() => data.host.image ?? PLACEHOLDER_IMAGE, [data.host.image]);

  const position: google.maps.LatLngLiteral = useMemo(() => {
    return HARDCODED_COORDINATES[data.id] ?? { lat: data.latitude, lng: data.longitude };
  }, [data.id, data.latitude, data.longitude]);

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
        logger.warn("Failed to create placeholder icon", {
          error: error instanceof Error ? error.message : String(error),
          component: "CustomMarker"
        });
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

        const markerIcon = createIconObject(canvas, displaySize, shadowPadding, 0);

        markerIconCache.set(cacheKey, markerIcon);
        isMounted && setIcon(markerIcon);
      } catch (error) {
        logger.warn("Failed to create marker icon with Canvas, falling back to direct URL", {
          error: error instanceof Error ? error.message : String(error),
          component: "CustomMarker"
        });

        // Fallback to direct URL approach when Canvas fails
        const fallbackIcon = {
          url: data.image || PLACEHOLDER_IMAGE,
          scaledSize: new google.maps.Size(displaySize, displaySize),
          anchor: new google.maps.Point(displaySize / 2, displaySize / 2),
        };

        markerIconCache.set(cacheKey, fallbackIcon);
        isMounted && setIcon(fallbackIcon);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [data.id, data.image, hostImage, displaySize, cacheKey]);

  if (!icon) return null;

  return (
    <Marker
      position={position}
      icon={icon}
      onClick={(e) => {
        if (e && e.domEvent) e.domEvent.stopPropagation();
        onClick();
      }}
      zIndex={isSelected ? 2 : 1}
      title={data.host.name}
    />
  );
};

export default CustomMarker;
