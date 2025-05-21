"use client";

import React, { FC, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IPlaceCard } from "@/app/places/data/type";
import useEmblaCarousel from "embla-carousel-react";
import PlaceCard from "@/app/places/components/Card";

interface PlaceCardsSheetProps {
  places: IPlaceCard[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
}

const PlaceCardsSheet: FC<PlaceCardsSheetProps> = ({ places, selectedPlaceId, onPlaceSelect }) => {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    loop: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  // 選択されたカードのインデックスを取得
  const initialSelectedIndex = useMemo(() => {
    if (!selectedPlaceId) return 0;
    const index = places.findIndex((place) => place.id === selectedPlaceId);
    return index >= 0 ? index : 0;
  }, [places, selectedPlaceId]);

  // 初期化時に選択されたカードにスクロール
  useEffect(() => {
    if (!emblaApi || !selectedPlaceId) return;

    const index = places.findIndex((place) => place.id === selectedPlaceId);
    if (index >= 0) {
      emblaApi.scrollTo(index, false); // アニメーションなしで即座にスクロール
    }
  }, [emblaApi, places, selectedPlaceId]);

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

  if (!places.length) return null;

  return (
    <div ref={emblaRef} className="overflow-hidden w-full">
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
              buttonVariant={place.id === selectedPlaceId ? "primary" : "tertiary"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceCardsSheet;
