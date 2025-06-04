"use client";

import React from "react";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";
import { OpportunityCard } from "@/app/activities/data/type";
import CarouselSectionSkeleton from "./CarouselSectionSkeleton";

interface OpportunitiesCarouselSectionProps {
  title: string;
  opportunities: OpportunityCard[];
  isInitialLoading?: boolean;
  isSearchResult?: boolean;
}

const OpportunitiesCarouselSection: React.FC<OpportunitiesCarouselSectionProps> = ({
  title,
  opportunities,
  isInitialLoading = false,
  isSearchResult = false,
}) => {
  if (isInitialLoading) return <CarouselSectionSkeleton title={title} />;
  if (opportunities.length === 0) return null;

  const match = isSearchResult ? title.match(/^(\d+)\/(\d+)\((.+)\)$/) : null;
  const [month, day, weekday] = match ? match.slice(1) : [];

  return (
    <section className="px-6 pr-0">
      {isSearchResult ? (
        <h2 className="flex items-baseline gap-1">
          <span className="text-md text-gray-500">{month}/</span>
          <span className="text-display-xl">{day}</span>
          <span className="text-sm text-gray-500">（{weekday}）</span>
        </h2>
      ) : (
        <h2 className="text-display-md">{title}</h2>
      )}
      <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {opportunities.map((opportunity) => (
          <OpportunityCardVertical key={opportunity.id} opportunity={opportunity} isCarousel />
        ))}
      </div>
    </section>
  );
};

export default OpportunitiesCarouselSection;
