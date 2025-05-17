import useEmblaCarousel from "embla-carousel-react";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

const AUTO_PLAY_INTERVAL = 5000;

export const ImagesCarousel = ({ images, title }: { images: string[]; title: string }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

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
    if (clientX < containerWidth * 0.3) emblaApi?.scrollPrev();
  };

  const handleRightClick = (e: React.MouseEvent) => {
    const { clientX } = e;
    const containerWidth = (e.currentTarget as HTMLElement).clientWidth;
    if (clientX > containerWidth * 0.7) emblaApi?.scrollNext();
  };

  return (
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
                alt={`${title} - 画像 ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* 左右クリックエリア */}
        <div className="absolute left-0 top-0 h-full w-[30%] cursor-pointer z-[1] hover:bg-gradient-to-r hover:from-black/10 hover:to-transparent" />
        <div className="absolute right-0 top-0 h-full w-[30%] cursor-pointer z-[1] hover:bg-gradient-to-l hover:from-black/10 hover:to-transparent" />
      </div>

      {/* インジケーター */}
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
  );
};
