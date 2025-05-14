"use client";

import React, { useEffect, useState } from "react";
import { ActivityCard } from "@/app/activities/data/type";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import FeaturedSectionSkeleton from "@/app/activities/components/FeaturedSection/FeaturedSectionSkeleton";
import { OpportunityCardHorizontal } from "@/app/activities/components/Card/CardHorizontal";

interface FeaturedSectionProps {
  opportunities: ActivityCard[];
  isInitialLoading?: boolean;
}

export default function ActivitiesFeaturedSection({
  opportunities,
  isInitialLoading = false,
}: FeaturedSectionProps) {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
  });

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
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="embla__slide relative h-full w-full flex-[0_0_100%]"
            >
              <OpportunityImageSlider images={opportunity.images ?? []} title={opportunity.title} />
              <OpportunityCardHorizontal opportunity={opportunity} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OpportunityImageSlider({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const slideImages = images.length > 0 ? images : [undefined];

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % slideImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [index, slideImages.length]);

  return (
    <div className="absolute inset-0 z-0">
      {slideImages.map((img, i) => {
        const isActive = i === index;
        const isPrevious = i === prevIndex;

        return (
          <Image
            key={i}
            src={img ?? "https://images.unsplash.com/photo-1578662996442-48f60103fc96"}
            alt={`${title} - ${i + 1}`}
            fill
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100" : isPrevious ? "opacity-0" : "hidden"
            }`}
            priority={i === 0}
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
