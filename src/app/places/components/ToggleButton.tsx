"use client";

import React from "react";
import { List, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";

interface PlaceToggleButtonProps {
  isMapMode: boolean;
  onClick: () => void;
}

const PlaceToggleButton: React.FC<PlaceToggleButtonProps> = ({ isMapMode, onClick }) => {
  const env = detectEnvironment();
  const isLiff = env === AuthEnvironment.LIFF;

  return (
    <div className={`fixed left-1/2 -translate-x-1/2 z-50 ${isLiff ? "bottom-28" : "bottom-24"}`}>
      <Button onClick={onClick} variant={"secondary"} size={"md"}>
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
