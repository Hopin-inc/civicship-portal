"use client";

import { ActivityCard, QuestCard } from "@/app/activities/data/type";
import { useCallback, useEffect, useState } from "react";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import useEmblaCarousel from "embla-carousel-react";
import { PLACEHOLDER_IMAGE } from "@/utils";
import OpportunityImageSlider from "@/app/activities/components/FeaturedSection/ImageSlider";

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
                <OpportunityCardHorizontal opportunity={op as ActivityCard} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
