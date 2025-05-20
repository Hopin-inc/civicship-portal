"use client";

import { useRouter } from "next/navigation";
import { BaseCardInfo } from "@/app/places/data/type";
import React from "react";
import PlaceToggleButton from "@/app/places/components/ToggleButton";
import PlaceCard from "@/app/places/components/Card";

interface PlaceListSheetProps {
  places: BaseCardInfo[];
  selectedPlaceId?: string | null;
  onMapClick: () => void;
}

const PlaceListPage: React.FC<PlaceListSheetProps> = ({ places, selectedPlaceId, onMapClick }) => {
  const router = useRouter();

  const handlePlaceClick = (placeId: string, userId: string) => {
    router.push(`/places/${placeId}?user_id=${userId}`);
  };

  return (
    <div className="min-h-screen w-full px-6 pt-6 pb-6 max-w-lg mx-auto">
      <div className="grid gap-4">
        {places
          .filter((place) => !selectedPlaceId || place.id === selectedPlaceId)
          .map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              selected={place.id === selectedPlaceId}
              onClick={() => handlePlaceClick(place.id, place.host.id)}
            />
          ))}
      </div>
      {!selectedPlaceId && <PlaceToggleButton isMapMode={false} onClick={onMapClick} />}
    </div>
  );
};

export default PlaceListPage;
