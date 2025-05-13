import React from "react";
import { BaseCardInfo } from "@/app/places/data/type";
import { MapComponentClient } from "./MapComponentClient";

interface MapComponentProps {
  places: BaseCardInfo[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
}

export default function MapComponent({
  places,
  selectedPlaceId,
  onPlaceSelect,
}: MapComponentProps) {
  return (
    <MapComponentClient
      places={places}
      selectedPlaceId={selectedPlaceId}
      onPlaceSelect={onPlaceSelect}
    />
  );
}
