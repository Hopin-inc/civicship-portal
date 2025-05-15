import React from "react";
import { BasePin } from "@/app/places/data/type";
import { MapComponentClient } from "./MapComponentClient";

interface MapComponentProps {
  placePins: BasePin[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
}

export default function MapComponent({
  placePins,
  selectedPlaceId,
  onPlaceSelect,
}: MapComponentProps) {
  return (
    <MapComponentClient
      placePins={placePins}
      selectedPlaceId={selectedPlaceId}
      onPlaceSelect={onPlaceSelect}
    />
  );
}
