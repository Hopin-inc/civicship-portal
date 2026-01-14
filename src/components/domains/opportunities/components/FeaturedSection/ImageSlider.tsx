"use client";

import useEmblaCarousel from "embla-carousel-react";
import { SafeImage } from "@/components/ui/safe-image";
import { useCallback, useEffect, useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/utils";

type Props = {
  images: string[];
  title: string;
  isVisible: boolean;
  onSlideChange?: (index: number) => void;
  onApiChange?: (api: any) => void;
};

export default function OpportunityImageSlider({
  images,
  title,
  isVisible,
  onSlideChange,
  onApiChange,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (emblaApi && onApiChange) {
      onApiChange(emblaApi);
    }
  }, [emblaApi, onApiChange]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    onSlideChange?.(index);
  }, [emblaApi, onSlideChange]);

  useEffect(() => {
    if (!emblaApi || !isVisible) return;

    emblaApi.on("select", onSelect);
    onSelect();

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi, isVisible, onSelect]);

  useEffect(() => {
    if (!emblaApi || isVisible) return;
    emblaApi.scrollTo(0, false);
    setSelectedIndex(0);
  }, [emblaApi, isVisible]);

  const slides = images.length ? images : [PLACEHOLDER_IMAGE];

  return (
    <div className="absolute inset-0 z-0">
      <div className="embla h-full relative" ref={emblaRef}>
        <div className="embla__container h-full">
          {slides.map((img, i) => (
            <div key={i} className="embla__slide relative w-full aspect-[3/2] flex-[0_0_100%]">
              <SafeImage
                src={img ?? PLACEHOLDER_IMAGE}
                alt={`${title} - ${i + 1}`}
                fill
                sizes="(max-width: 480px) 100vw, 480px"
                loading={i === 0 ? "eager" : "lazy"}
                priority={i === 0}
                placeholder="blur"
                blurDataURL={PLACEHOLDER_IMAGE}
                className="object-cover"
                fallbackSrc={PLACEHOLDER_IMAGE}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 z-10">
        {slides.map((_, i) => (
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
