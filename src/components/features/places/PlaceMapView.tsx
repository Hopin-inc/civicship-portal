"use client";

import React from "react";
import PlaceToggleButton from "./shared/PlaceToggleButton";
import PlaceCardsSheet from "./shared/PlaceCardsSheet";
import { BaseCardInfo } from "@/types/place";
import MapComponent from "./map/MapComponent";


interface PlaceMapViewProps {
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
  toggleMode: () => void;
  places: BaseCardInfo[];
}

const PlaceMapView: React.FC<PlaceMapViewProps> = ({
  selectedPlaceId,
  onPlaceSelect,
  toggleMode,
  places,
}) => {
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
