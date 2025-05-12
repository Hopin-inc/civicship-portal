import PlaceCard from "@/app/places/components/list/PlaceCard";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BaseCardInfo } from "@/app/places/data/type";
import React from "react";
import { Map } from "lucide-react";

interface PlaceListSheetProps {
  places: BaseCardInfo[];
  selectedPlaceId?: string | null;
  onMapClick: () => void;
}

export const PlaceListPage: React.FC<PlaceListSheetProps> = ({
  places,
  selectedPlaceId,
  onMapClick,
}) => {
  const router = useRouter();

  const handlePlaceClick = (placeId: string, userId: string) => {
    router.push(`/places/${placeId}?userId=${userId}`);
  };

  return (
    <div className="min-h-screen w-full px-6 pt-16 pb-24 max-w-lg mx-auto">
      <div className="grid gap-4">
        {places
          .filter((place) => !selectedPlaceId || place.id === selectedPlaceId)
          .map((place) => (
            <PlaceCard
              key={place.id}
              placeId={place.id}
              placeName={place.name}
              placeImage={place.image}
              participantCount={place.participantCount}
              bio={place.bio}
              activeOpportunityCount={place.publicOpportunityCount}
              onClick={() => handlePlaceClick(place.id, place.host.id)}
            />
          ))}
      </div>

      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
        <Button onClick={onMapClick} variant="secondary">
          <span>地図</span>
          <Map className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
