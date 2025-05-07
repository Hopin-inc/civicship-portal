'use client';

import React, { useRef, useEffect, useState } from 'react';

interface PlaceMapSheetProps {
  selectedPlaceId?: string | null;
  totalPlaces: number;
  onDragUp?: () => void;
}

const PlaceMapSheet: React.FC<PlaceMapSheetProps> = ({
  selectedPlaceId,
  totalPlaces,
  onDragUp
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState('80px');
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  useEffect(() => {
    if (selectedPlaceId) {
      setSheetHeight('50dvh');
    } else {
      setSheetHeight('80px');
    }
  }, [selectedPlaceId]);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const handleTouchStart = (e: TouchEvent) => {
      startYRef.current = e.touches[0].clientY;
      startHeightRef.current = sheet.clientHeight;
      sheet.style.transition = 'none';
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = startYRef.current - e.touches[0].clientY;
      const newHeight = Math.max(100, startHeightRef.current + deltaY);
      sheet.style.height = `${newHeight}px`;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const windowHeight = window.innerHeight;
      sheet.style.transition = 'height 0.3s ease';
      
      if (sheet.clientHeight > windowHeight * 0.3) {
        onDragUp && onDragUp();
      } else {
        sheet.style.height = selectedPlaceId ? '50dvh' : '100px';
      }
    };

    sheet.addEventListener('touchstart', handleTouchStart);
    sheet.addEventListener('touchmove', handleTouchMove);
    sheet.addEventListener('touchend', handleTouchEnd);

    return () => {
      sheet.removeEventListener('touchstart', handleTouchStart);
      sheet.removeEventListener('touchmove', handleTouchMove);
      sheet.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onDragUp, selectedPlaceId]);

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 bg-background shadow-lg rounded-t-[20px] transition-[height] duration-300 ease-in-out z-40"
      style={{ height: sheetHeight }}
    >
      <div className="flex items-center justify-center h-1.5 w-12 mx-auto mt-6 mb-3">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>
      <div className="text-center py-1.5 text-muted-foreground text-sm px-6">
        {selectedPlaceId ? "選択された拠点の情報" : `${totalPlaces}箇所の拠点が表示されています`}
      </div>
    </div>
  );
};

export default PlaceMapSheet;
