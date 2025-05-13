"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, MapPin, Ticket } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { ActivityDetail } from "@/app/activities/data/type";

interface ActivityDetailsHeaderProps {
  opportunity: ActivityDetail;
  availableTickets: number;
}

const AUTO_PLAY_INTERVAL = 5000;

const ActivityDetailsHeader: React.FC<ActivityDetailsHeaderProps> = ({
  opportunity,
  availableTickets,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const images = opportunity.images?.length
    ? opportunity.images
    : ["/placeholder.png", "/placeholder.png", "/placeholder.png"];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();

    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplayInterval);
    };
  }, [emblaApi, onSelect]);

  const handleLeftClick = (e: React.MouseEvent) => {
    const { clientX } = e;
    const containerWidth = (e.currentTarget as HTMLElement).clientWidth;

    if (clientX < containerWidth * 0.3) {
      emblaApi?.scrollPrev();
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    const { clientX } = e;
    const containerWidth = (e.currentTarget as HTMLElement).clientWidth;

    if (clientX > containerWidth * 0.7) {
      emblaApi?.scrollNext();
    }
  };

  return (
    <div className="relative w-full bg-background pb-6 max-w-mobile-l mx-auto">
      <div className="relative h-[480px] overflow-hidden mb-6 mx-[-1rem] sm:mx-[-1.5rem] md:mx-[-2rem]">
        <div
          className="embla h-full relative"
          ref={emblaRef}
          onClick={(e) => {
            handleLeftClick(e);
            handleRightClick(e);
          }}
        >
          <div className="embla__container h-full">
            {images.map((image, index) => (
              <div key={index} className="embla__slide relative h-full w-full flex-[0_0_100%]">
                <Image
                  src={image}
                  alt={`${opportunity.title} - 画像 ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* 左右のクリック領域 */}
          <div className="absolute left-0 top-0 h-full w-[30%] cursor-pointer z-[1] hover:bg-gradient-to-r hover:from-black/10 hover:to-transparent" />
          <div className="absolute right-0 top-0 h-full w-[30%] cursor-pointer z-[1] hover:bg-gradient-to-l hover:from-black/10 hover:to-transparent" />
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 z-10">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-sm transition-all duration-300 ${
                index === selectedIndex ? "w-8 bg-white" : "w-4 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-display-lg mb-4">{opportunity.title}</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col -mt-1">
              <span className="text-body-md">{opportunity.place?.name || "場所未定"}</span>
              <span className="text-body-sm text-caption">{opportunity.place?.address}</span>
            </div>
          </div>
        </div>
      </div>

      {opportunity.reservableTickets.length > 0 && availableTickets > 0 && (
        <div className="flex items-center gap-2 bg-primary-foreground text-primary rounded-lg px-4 py-3 mt-4 cursor-pointer hover:bg-primary-foreground/80">
          <Ticket className="w-5 h-5" />
          <p className="text-label-md">利用できるチケット</p>
          <p className="text-label-md font-bold">{availableTickets}枚</p>
          <ChevronRight className="w-4 h-4 ml-auto" />
        </div>
      )}
    </div>
  );
};

export default ActivityDetailsHeader;
