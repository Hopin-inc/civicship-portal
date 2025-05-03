'use client';

import React from 'react';
import { List, MapPin } from 'lucide-react';
import { Button } from "@/app/components/ui/button";

interface PlaceToggleButtonProps {
  isMapMode: boolean;
  onClick: () => void;
}

const PlaceToggleButton: React.FC<PlaceToggleButtonProps> = ({ isMapMode, onClick }) => {
  if (isMapMode) {
    return (
      <div className="fixed bottom-[104px] left-1/2 -translate-x-1/2 z-50">
        <Button
          onClick={onClick}
          variant="secondary"
          className="w-[104px] h-[48px] rounded-full flex items-center justify-center gap-1.5"
        >
          <List className="h-4 w-4" />
          一覧
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={onClick}
        variant="primary"
        className="w-[104px] h-[48px] rounded-full flex items-center justify-center gap-1.5"
      >
        <MapPin className="h-4 w-4" />
        地図
      </Button>
    </div>
  );
};

export default PlaceToggleButton;
