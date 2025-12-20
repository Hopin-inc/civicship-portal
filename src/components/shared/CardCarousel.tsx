"use client";

interface CardCarouselProps {
  children: React.ReactNode;
}

/**
 * @deprecated This component uses horizontal scrolling (overflow-x-auto).
 * Use vertical flex layout with OpportunityHorizontalCard instead.
 */
export function CardCarousel({
  children,
}: CardCarouselProps) {
  return (
    <div 
      className="flex gap-4 overflow-x-auto scrollbar-hide"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {children}
    </div>
  );
}
