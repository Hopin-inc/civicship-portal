"use client";

import React, { useEffect, useState } from "react";
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
    onSelect(); // 初期化時にも呼ぶ

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (isInitialLoading) return <FeaturedSectionSkeleton />;
  if (opportunities.length === 0) return null;

  return (
    <section className="relative h-[70vh] w-full overflow-hidden [&]:mt-0 mb-12">
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent py-10 px-8 text-white">
        <h1 className="text-4xl font-bold leading-tight">
          四国にふれる
          <br />
          わたし、ふるえる
        </h1>
      </div>

      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {opportunities.map((opportunity, i) => (
            <div
              key={opportunity.id}
              className="embla__slide relative h-full w-full flex-[0_0_100%]"
            >
              <OpportunityImageSlider
                images={opportunity.images ?? []}
                title={opportunity.title}
                isVisible={i === selectedIndex}
              />
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
}: {
  images: string[];
  title: string;
  isVisible: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const slideImages = images.length > 0 ? images : [undefined];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % slideImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [index, slideImages.length, isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setIndex(0);
      setPrevIndex(null);
    }
  }, [isVisible]);

  return (
    <div className="absolute inset-0 z-0">
      {slideImages.map((img, i) => {
        const isActive = i === index;
        const isPrevious = i === prevIndex;

        return (
          <Image
            key={i}
            src={img ?? PLACEHOLDER_IMAGE}
            alt={`${title} - ${i + 1}`}
            fill
            sizes="(max-width: 480px) 100vw, 480px"
            loading={i === 0 ? "eager" : "lazy"}
            priority={i === 0}
            placeholder={`blur`}
            blurDataURL={PLACEHOLDER_IMAGE}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100" : isPrevious ? "opacity-0" : "hidden"
            }`}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = PLACEHOLDER_IMAGE;
            }}
          />
        );
      })}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 z-10">
        {slideImages.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-sm transition-all duration-300 ${
              i === index ? "w-8 bg-white" : "w-4 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
