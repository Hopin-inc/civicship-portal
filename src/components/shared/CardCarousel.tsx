"use client";

interface CardCarouselProps {
  children: React.ReactNode;
}

export function CardCarousel({
  children,
}: CardCarouselProps) {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide">
      {children}
    </div>
  );
}