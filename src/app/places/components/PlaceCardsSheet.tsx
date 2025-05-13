"use client";

import React, { FC, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BaseCardInfo } from "@/app/places/data/type";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  useAutoScrollToSelectedCard(scrollContainerRef, selectedPlaceId);

  if (!places.length) return null;

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      scrollToNearestCard(container, selectedPlaceId, onPlaceSelect);
    }, 150);
  };

  const handlePlaceClick = (placeId: string, userId: string) => {
    onPlaceSelect(placeId);
    router.push(`/places/${placeId}?userId=${userId}`);
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-4 left-0 right-0 z-50 mx-4"
    >
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative overflow-x-auto hide-scrollbar snap-x snap-mandatory max-w-[510px] mx-auto"
      >
        <div className="flex gap-4 pb-2 px-2">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              selected={place.id === selectedPlaceId}
              onClick={() => handlePlaceClick(place.id, place.host.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const PlaceCard: React.FC<PlaceCardProps> = ({ place, selected, onClick }) => (
  <Card
    data-place-id={place.id}
    onClick={onClick}
    className={`flex-none w-[345px] snap-center transform transition-transform duration-200 ${
      selected ? "scale-[1.02]" : "scale-100"
    }`}
  >
    <div className="relative h-40 rounded-t-lg overflow-hidden">
      <Image
        src={place.image}
        alt={place.headline}
        className="object-cover"
        fill
        sizes="(max-width: 768px) 100vw, 345px"
      />
    </div>

    <CardContent className="flex flex-col min-h-[200px] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground truncate max-w-[180px]">
          📍{place.address}
        </span>
        <span className="text-sm text-gray-700">👥{place.participantCount}人</span>
      </div>

      <CardTitle className="text-lg line-clamp-2">{place.headline}</CardTitle>
      <CardDescription className="line-clamp-2 mb-4">{place.bio}</CardDescription>

      <CardFooter className="flex justify-between mt-auto pt-2 p-0">
        {place.publicOpportunityCount > 0 && (
          <span className="text-sm text-gray-700">
            <strong>{place.publicOpportunityCount}件</strong>の関わり方を募集中
          </span>
        )}
        <Button>もっと見る</Button>
      </CardFooter>
    </CardContent>
  </Card>
);

const useAutoScrollToSelectedCard = (
  containerRef: React.RefObject<HTMLElement>,
  selectedId: string | null,
) => {
  useEffect(() => {
    if (!selectedId || !containerRef.current) return;

    const selectedCard = containerRef.current.querySelector<HTMLElement>(
      `[data-place-id="${selectedId}"]`,
    );
    selectedCard?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedId]);
};

const scrollToNearestCard = (
  container: HTMLElement,
  selectedPlaceId: string | null,
  onPlaceSelect: (placeId: string) => void,
) => {
  const containerRect = container.getBoundingClientRect();
  const containerCenter = containerRect.left + containerRect.width / 2;

  let closestCard: HTMLElement | null = null;
  let minDistance = Infinity;

  const cards = Array.from(container.querySelectorAll("[data-place-id]")) as HTMLElement[];

  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist = Math.abs(center - containerCenter);

    if (dist < minDistance) {
      minDistance = dist;
      closestCard = card;
    }
  }

  const selectedCard = container.querySelector(
    `[data-place-id="${selectedPlaceId}"]`,
  ) as HTMLElement | null;

  selectedCard?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });

  const placeId = closestCard?.dataset?.placeId;
  if (placeId && placeId !== selectedPlaceId) {
    onPlaceSelect(placeId);
  }
};

export default PlaceCardsSheet;
