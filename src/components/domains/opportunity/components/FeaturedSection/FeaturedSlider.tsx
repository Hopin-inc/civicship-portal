"use client";

import { ActivityCard, QuestCard } from "@/components/domains/opportunity/types";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { PLACEHOLDER_IMAGE } from "@/utils";
import OpportunityImageSlider from "@/components/domains/opportunity/components/FeaturedSection/ImageSlider";
import OpportunityHorizontalCard from "../OpportunityHorizontalCard";
import { JapaneseYenIcon, MapPin } from "lucide-react";
import { GqlOpportunityCategory } from "@/types/graphql";

export default function FeaturedSlider({
  opportunities,
}: {
  opportunities: (ActivityCard | QuestCard)[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [imageSliderApi, setImageSliderApi] = useState<any>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const id = requestIdleCallback(() => {
      const onSelect = () => {
        const index = emblaApi.selectedScrollSnap();
        setSelectedIndex(index);
        imageSliderApi?.scrollTo(index);
      };
      emblaApi.on("select", onSelect);
      onSelect();

      return () => emblaApi.off("select", onSelect);
    });

    return () => cancelIdleCallback(id);
  }, [emblaApi, imageSliderApi]);

  const handleImageSlideChange = useCallback(
    (index: number) => emblaApi?.scrollTo(index % opportunities.length),
    [emblaApi, opportunities.length],
  );

  const images = opportunities.map((op) => op.images?.[1] ?? PLACEHOLDER_IMAGE);

  return (
    <>
      <OpportunityImageSlider
        images={images}
        title={opportunities[selectedIndex]?.title ?? ""}
        isVisible
        onSlideChange={handleImageSlideChange}
        onApiChange={setImageSliderApi}
      />
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {opportunities.map((op) => (
            <div key={op.id} className="embla__slide relative h-full w-full flex-[0_0_100%]">
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/40 to-transparent px-6 pb-8 pt-16">
                <OpportunityHorizontalCard
                  opportunity={op as ActivityCard}
                  href={`/activities/${op.id}?community_id=${op.communityId}`}
                  price={op.category === GqlOpportunityCategory.Activity ? "feeRequired" in op ? op.feeRequired?.toLocaleString() : "参加無料" : "参加無料"}
                  priceIcon={<JapaneseYenIcon className="w-4 h-4" />}
                  location={op.location}
                  locationIcon={<MapPin className="mr-1 h-4 w-4 flex-shrink-0" />}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
