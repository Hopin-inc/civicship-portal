"use client";

import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BaseCardInfo } from "@/app/places/data/type";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/utils";
import useEmblaCarousel from "embla-carousel-react";

interface PlaceCardsSheetProps {
  places: BaseCardInfo[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
}

interface PlaceCardProps {
  place: BaseCardInfo;
  selected: boolean;
  onClick: () => void;
}

const PlaceCardsSheet: FC<PlaceCardsSheetProps> = ({ places, selectedPlaceId, onPlaceSelect }) => {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    loop: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);
      const place = places[index];
      if (place && place.id !== selectedPlaceId) {
        onPlaceSelect(place.id);
      }
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, places, selectedPlaceId, onPlaceSelect]);

  const handlePlaceClick = (placeId: string, userId: string) => {
    onPlaceSelect(placeId);
    router.push(`/places/${placeId}?userId=${userId}`);
  };

  if (!places.length) return null;

  return (
    <div ref={emblaRef} className="overflow-hidden px-4">
      <div className="flex">
        {places.map((place) => (
          <div
            key={place.id}
            className="flex-[0_0_100%] max-w-[340px] px-2"
            data-place-id={place.id}
          >
            <PlaceCard
              place={place}
              selected={place.id === selectedPlaceId}
              onClick={() => handlePlaceClick(place.id, place.host.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const PlaceCard: React.FC<PlaceCardProps> = ({ place, selected, onClick }) => (
  <Card
    className={`w-full transition-transform duration-200 ${
      selected ? "scale-[1.02]" : "scale-100"
    }`}
  >
    <div className="relative h-32 rounded-t-lg overflow-hidden">
      <Image
        src={place.image ?? PLACEHOLDER_IMAGE}
        alt={place.headline}
        className="object-cover"
        fill
        placeholder={`blur`}
        blurDataURL={PLACEHOLDER_IMAGE}
        sizes="(max-width: 768px) 100vw, 320px"
      />
    </div>
    <CardContent className="flex flex-col min-h-[160px] px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <div className="mt-1 flex items-center text-muted-foreground text-body-sm">
          <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1 break-words">{place.name}</span>
        </div>
        <div className="mt-1 flex items-center text-muted-foreground text-body-sm">
          <Users className="mr-1 h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1 break-words">{place.participantCount}人</span>
        </div>
      </div>

      <CardTitle className="text-md line-clamp-1">{place.headline}</CardTitle>
      <CardDescription className="line-clamp-2 mb-2">{place.bio}</CardDescription>

      <CardFooter className="flex justify-between mt-2 p-0">
        {place.publicOpportunityCount > 0 && (
          <span className="text-label-sm text-gray-700">
            <strong>{place.publicOpportunityCount}件</strong>の関わり方を募集中
          </span>
        )}
        <Button size="sm" variant="primary" onClick={onClick}>
          もっと見る
        </Button>
      </CardFooter>
    </CardContent>
  </Card>
);

export default PlaceCardsSheet;
