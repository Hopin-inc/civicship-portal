'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MarkerData } from '@/types/map';
import { createCustomMarkerIcon, defaultImageUrl, drawCircleWithImage } from '@/utils/maps/markerUtils';

interface CustomMarkerProps {
  data: MarkerData;
  onClick: () => void;
  isSelected: boolean;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ data, onClick, isSelected }) => {
  const [icon, setIcon] = useState<google.maps.Icon | null>(null);
  const [currentSize, setCurrentSize] = useState<number>(56);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const markerDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isSelected && currentSize !== 80) {
      setCurrentSize(80);
    } else if (!isSelected && currentSize !== 56) {
      setCurrentSize(56);
    }
  }, [isSelected, currentSize]);

  useEffect(() => {
    const loadIcon = async () => {
      const displaySize = currentSize;
      const scale = 2;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;

      const canvasWidth = displaySize * scale;
      const canvasHeight = displaySize * scale;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${displaySize}px`;
      canvas.style.height = `${displaySize}px`;

      context.scale(scale, scale);

      try {
        const centerX = displaySize / 2;
        const centerY = displaySize / 2;
        const mainRadius = displaySize / 2 - 2;
        const smallRadius = mainRadius * 0.4;
        const smallX = centerX + mainRadius * 0.5;
        const smallY = centerY + mainRadius * 0.5;

        const mainImg = document.createElement("img");
        mainImg.src = data.placeImage || defaultImageUrl;
        await drawCircleWithImage(context, mainImg, centerX, centerY, mainRadius, true);

        const userImg = document.createElement("img");
        userImg.src = data.userImage || defaultImageUrl;
        await drawCircleWithImage(context, userImg, smallX, smallY, smallRadius, false);

        setIcon({
          url: canvas.toDataURL("image/png", 1.0),
          scaledSize: new google.maps.Size(displaySize, displaySize),
          anchor: new google.maps.Point(displaySize / 2, displaySize / 2),
        });
      } catch (error) {
        console.warn("Failed to create marker icon:", error);
        context.beginPath();
        context.arc(displaySize / 2, displaySize / 2, displaySize / 2 - 4, 0, 2 * Math.PI);
        context.fillStyle = "#F0F0F0";
        context.fill();
        context.strokeStyle = "#E0E0E0";
        context.lineWidth = 2;
        context.stroke();

        setIcon({
          url: canvas.toDataURL("image/png", 1.0),
          scaledSize: new google.maps.Size(displaySize, displaySize),
          anchor: new google.maps.Point(displaySize / 2, displaySize / 2),
        });
      }
    };

    loadIcon();
  }, [currentSize, data.placeImage, data.userImage]);

  useEffect(() => {
    if (!icon || !icon.scaledSize) return;

    const createOrUpdateMarker = async () => {
      try {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        
        const width = icon.scaledSize!.width;
        const height = icon.scaledSize!.height;
        
        const imgElement = document.createElement('img');
        imgElement.src = icon.url;
        imgElement.style.width = `${width}px`;
        imgElement.style.height = `${height}px`;
        
        if (!markerDivRef.current) {
          markerDivRef.current = document.createElement('div');
          markerDivRef.current.style.cursor = 'pointer';
          markerDivRef.current.addEventListener('click', onClick);
        }
        
        markerDivRef.current.innerHTML = '';
        markerDivRef.current.appendChild(imgElement);
        
        if (!markerRef.current) {
          markerRef.current = new AdvancedMarkerElement({
            position: data.position,
            content: markerDivRef.current,
            title: data.name,
            zIndex: isSelected ? 2 : 1,
          });
        } else {
          markerRef.current.position = data.position;
          markerRef.current.content = markerDivRef.current;
          markerRef.current.zIndex = isSelected ? 2 : 1;
        }
      } catch (error) {
        console.error("Error creating AdvancedMarkerElement:", error);
      }
    };

    createOrUpdateMarker();

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
      }
    };
  }, [icon, data.position, data.name, isSelected, onClick]);

  return null; // The marker is managed imperatively
};

export default CustomMarker;
