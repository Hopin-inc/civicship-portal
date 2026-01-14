"use client";

import React from "react";
import PlaceToggleButton from "@/app/[communityId]/places/components/ToggleButton";
import PlaceCard from "@/app/[communityId]/places/components/Card";
import { IPlaceCard } from "@/app/[communityId]/places/data/type";

interface PlaceListSheetProps {
  places: IPlaceCard[];
  selectedPlaceId?: string | null;
  onMapClick: () => void;
}

const PlaceListPage: React.FC<PlaceListSheetProps> = ({ places, selectedPlaceId, onMapClick }) => {
  return (
    <div className="min-h-screen w-full px-6 pt-6 pb-6 max-w-lg mx-auto">
      <div className="grid gap-4">
        {places
          .filter((place) => !selectedPlaceId || place.id === selectedPlaceId)
          .map((place) => (
            <PlaceCard key={place.id} place={place} selected={place.id === selectedPlaceId} />
          ))}
      </div>
      {!selectedPlaceId && <PlaceToggleButton isMapMode={false} onClick={onMapClick} />}
    </div>
  );
};

export default PlaceListPage;
