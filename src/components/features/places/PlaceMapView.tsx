"use client";

import React from "react";
import dynamic from "next/dynamic";
import PlaceToggleButton from "./shared/PlaceToggleButton";
import PlaceCardsSheet from "./shared/PlaceCardsSheet";
import { BaseCardInfo } from "@/types/place";

const MapComponent = dynamic(() => import("./map/MapComponent"), {
  ssr: false,
  loading: () => <></>,
});

interface PlaceMapViewProps {
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
  toggleMode: () => void;
  places: BaseCardInfo[];
}

const PlaceMapView: React.FC<PlaceMapViewProps> = ({
  selectedPlaceId,
  onPlaceSelect,
  // onClose,
  toggleMode,
  places,
}) => {
  const handlePlaceSelect = (placeId: string) => {
    console.log("Selected:", placeId);
  };

  return (
    <div className="relative h-full w-full">
      <MapComponent
        places={places}
        selectedPlaceId={selectedPlaceId}
        onPlaceSelect={onPlaceSelect}
      />
      {!selectedPlaceId && <PlaceToggleButton isMapMode={true} onClick={toggleMode} />}
      {selectedPlaceId && (
        <PlaceCardsSheet
          places={places}
          selectedPlaceId={selectedPlaceId}
          onPlaceSelect={onPlaceSelect}
        />
      )}
    </div>
  );
};

export default PlaceMapView;
