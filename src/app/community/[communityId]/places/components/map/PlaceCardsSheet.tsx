"use client";

import React, { FC, useEffect, useMemo, useRef } from "react";
import { IPlaceCard } from "@/app/community/[communityId]/places/data/type";
import useEmblaCarousel from "embla-carousel-react";
import PlaceCard from "@/app/community/[communityId]/places/components/Card";

interface PlaceCardsSheetProps {
  places: IPlaceCard[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
}

const PlaceCardsSheet: FC<PlaceCardsSheetProps> = ({ places, selectedPlaceId, onPlaceSelect }) => {
  const isProgrammaticScrollRef = useRef(false);

  const selectedIndex = useMemo(() => {
    if (!selectedPlaceId) return 0;
    const index = places.findIndex((place) => place.id === selectedPlaceId);
    return index >= 0 ? index : 0;
  }, [places, selectedPlaceId]);

  // カルーセルの初期化
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    loop: false,
    startIndex: selectedIndex,
  });

  useEffect(() => {
    if (!emblaApi) return;

    if (selectedPlaceId) {
      isProgrammaticScrollRef.current = true;
      emblaApi.scrollTo(selectedIndex, false);

      const timer = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [emblaApi, selectedPlaceId, selectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      if (isProgrammaticScrollRef.current) {
        console.debug("プログラムによるスクロール中のため選択イベントをスキップ");
        return;
      }
      const index = emblaApi.selectedScrollSnap();
      const place = places[index];
      console.debug(
        `カード選択 - インデックス: ${index}, ID: ${place?.id}, 現在の選択ID: ${selectedPlaceId}`,
      );
      console.debug(`選択されたカードデータ:`, place);
      if (place && place.id !== selectedPlaceId) {
        onPlaceSelect(place.id);
      }
    };

    emblaApi.on("select", onSelect);

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
