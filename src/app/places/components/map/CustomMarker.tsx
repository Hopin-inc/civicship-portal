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

const CustomMarker: React.FC<CustomMarkerProps> = ({ data, onClick, isSelected }) => {
  const [icon, setIcon] = useState<google.maps.Icon | null>(null);
  const [currentSize, setCurrentSize] = useState<number>(56);

  useEffect(() => {
    const drawPlaceholderIcon = async () => {
      const displaySize = 56;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = displaySize * 2;
      canvas.height = displaySize * 2;
      ctx.scale(2, 2);

      const img = new Image();
      img.src = PLACEHOLDER_IMAGE;
      await img.decode();

      await drawCircleWithImage(
        ctx,
        img,
        displaySize / 2,
        displaySize / 2,
        displaySize / 2 - 2,
        true,
      );

      const icon: google.maps.Icon = {
        url: canvas.toDataURL("image/png"),
        scaledSize: new google.maps.Size(displaySize, displaySize),
        anchor: new google.maps.Point(displaySize / 2, displaySize / 2),
      };

      setIcon(icon);
    };

    void drawPlaceholderIcon();
  }, []);

  useEffect(() => {
    if (isSelected && currentSize !== 80) {
      setCurrentSize(80);
    } else if (!isSelected && currentSize !== 56) {
      setCurrentSize(56);
    }
  }, [isSelected, currentSize]);

  useEffect(() => {
    (async () => {
      const displaySize = currentSize;
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

        const mainImg = new Image();
        mainImg.src = data.image || PLACEHOLDER_IMAGE;
        await drawCircleWithImage(context, mainImg, centerX, centerY, mainRadius, true);

        const userImg = new Image();
        userImg.src = data.host.image || PLACEHOLDER_IMAGE;
        await drawCircleWithImage(context, userImg, smallX, smallY, smallRadius, false);

        const markerIcon: google.maps.Icon = {
          url: canvas.toDataURL("image/png", 1.0),
          scaledSize: new google.maps.Size(displaySize, displaySize),
          anchor: new google.maps.Point(displaySize / 2, displaySize / 2),
        };

        setIcon(markerIcon);
      } catch (error) {
        console.warn("Failed to create marker icon:", error);
      }
    })();
  }, [currentSize, data.image, data.host.image]);

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
