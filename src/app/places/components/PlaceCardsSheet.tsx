"use client";

import { FC, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BaseCardInfo } from "@/app/places/data/type";

interface PlaceCardsSheetProps {
  places: BaseCardInfo[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
}

const PlaceCardsSheet: FC<PlaceCardsSheetProps> = ({ places, selectedPlaceId, onPlaceSelect }) => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!selectedPlaceId || !scrollContainerRef.current) return;

    const selectedCard = scrollContainerRef.current.querySelector<HTMLElement>(
      `[data-place-id="${selectedPlaceId}"]`,
    );
    selectedCard?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedPlaceId]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
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
    }, 150);
  };

  const handlePlaceClick = (placeId: string, userId: string) => {
    onPlaceSelect(placeId);
    router.push(`/places/${placeId}?userId=${userId}`);
  };

  if (places.length === 0) return null;

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
            <motion.div
              key={place.id}
              data-place-id={place.id}
              className={`flex-none w-[345px] bg-background rounded-2xl shadow-lg transform transition-transform duration-200 snap-center ${
                selectedPlaceId === place.id ? "scale-[1.02]" : "scale-100"
              }`}
              onClick={() => handlePlaceClick(place.id, place.host.id)}
            >
              <div className="relative h-40 rounded-t-2xl overflow-hidden">
                <Image
                  src={place.image}
                  alt={place.headline}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 345px"
                />
              </div>

              <div className="p-4 flex flex-col min-h-[200px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground truncate max-w-[180px]">
                    📍{place.address}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    👥{place.participantCount}人
                  </div>
                </div>

                <h2 className="text-lg font-bold mb-2 line-clamp-2">{place.headline}</h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{place.bio}</p>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div>
                    {place.publicOpportunityCount > 0 && (
                      <span className="text-gray-700 text-sm">
                        <strong>{place.publicOpportunityCount}件</strong>の関わり方を募集中
                      </span>
                    )}
                  </div>
                  <Button>もっと見る</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
};

export default PlaceCardsSheet;
