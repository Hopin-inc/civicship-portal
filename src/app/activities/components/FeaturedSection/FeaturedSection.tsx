"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ActivityCard } from "@/app/activities/data/type";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import FeaturedSectionSkeleton from "@/app/activities/components/FeaturedSection/FeaturedSectionSkeleton";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface FeaturedSectionProps {
  opportunities: ActivityCard[];
  isInitialLoading?: boolean;
}

export default function ActivitiesFeaturedSection({
  opportunities,
  isInitialLoading = false,
}: FeaturedSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleImageSlideChange = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index % opportunities.length);
      }
    },
    [emblaApi, opportunities.length],
  );

  if (isInitialLoading) return <FeaturedSectionSkeleton />;
  if (opportunities.length === 0) return null;

  const featuredImages = opportunities.map(
    (_, i) => `/images/activities/featured/image-${(i % 5) + 1}.png`,
  );

  return (
    <section className="relative h-[70vh] w-full overflow-hidden [&]:mt-0 mb-12">
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent pt-16 pb-10 px-8 text-white">
        <h1 className="text-4xl font-bold leading-tight">
          四国にふれる
          <br />
          わたし、ふるえる
        </h1>
      </div>

      <OpportunityImageSlider
        images={featuredImages}
        title={opportunities[selectedIndex]?.title || ""}
        isVisible={true}
        onSlideChange={handleImageSlideChange}
      />

      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {opportunities.map((opportunity, i) => (
            <div
              key={opportunity.id}
              className="embla__slide relative h-full w-full flex-[0_0_100%]"
            >
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/40 to-transparent px-6 pb-8 pt-16">
                <OpportunityCardHorizontal opportunity={opportunity} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OpportunityImageSlider({
  images,
  title,
  isVisible,
  onSlideChange,
}: {
  images: string[];
  title: string;
  isVisible: boolean;
  onSlideChange?: (index: number) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);

    if (onSlideChange) {
      onSlideChange(index);
    }
  }, [emblaApi, onSlideChange]);

  useEffect(() => {
    if (!emblaApi || !isVisible) return;

    emblaApi.on("select", onSelect);
    onSelect();

    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplayInterval);
    };
  }, [emblaApi, onSelect, isVisible]);

  useEffect(() => {
    if (!emblaApi) return;

    if (!isVisible) {
      emblaApi.scrollTo(0, false);
      setSelectedIndex(0);
    }
  }, [emblaApi, isVisible]);

  const slideImages = images.length > 0 ? images : [PLACEHOLDER_IMAGE];

  return (
    <div className="absolute inset-0 z-0">
      <div className="embla h-full relative" ref={emblaRef}>
        <div className="embla__container h-full">
          {slideImages.map((img, index) => (
            <div key={index} className="embla__slide relative h-full w-full flex-[0_0_100%]">
              <Image
                src={img ?? PLACEHOLDER_IMAGE}
                alt={`${title} - ${index + 1}`}
                fill
                sizes="(max-width: 480px) 100vw, 480px"
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
                placeholder={`blur`}
                blurDataURL={PLACEHOLDER_IMAGE}
                className="object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 z-10">
        {slideImages.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-sm transition-all duration-300 ${
              i === selectedIndex ? "w-8 bg-white" : "w-4 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
