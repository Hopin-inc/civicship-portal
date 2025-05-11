"use client";

import React from "react";
import { List, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaceToggleButtonProps {
  isMapMode: boolean;
  onClick: () => void;
}

const PlaceToggleButton: React.FC<PlaceToggleButtonProps> = ({ isMapMode, onClick }) => {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
      <Button onClick={onClick}>
        {isMapMode ? (
          <>
            <List className="h-5 w-5" />
            一覧
          </>
        ) : (
          <>
            <MapPin className="h-5 w-5" />
            地図
          </>
        )}
      </Button>
    </div>
  );
};

export default PlaceToggleButton;
