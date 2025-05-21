"use client";

import React from "react";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";
import { ActivityCard } from "@/app/activities/data/type";
import CarouselSectionSkeleton from "@/app/activities/components/CarouselSection/CarouselSectionSkeleton";

interface Props {
  title: string;
  opportunities: ActivityCard[];
  isInitialLoading?: boolean;
}

export const ActivitiesCarouselSection: React.FC<Props> = ({
  title,
  opportunities,
  isInitialLoading = false,
}) => {
  if (isInitialLoading) return <CarouselSectionSkeleton title={title} />;
  if (opportunities.length === 0) return null;

  return (
    <section className="pl-4 pr-0 mt-0 pt-6">
      <h2 className="text-display-md">{title}</h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {opportunities.map((opportunity) => (
          <OpportunityCardVertical key={opportunity.id} opportunity={opportunity} isCarousel />
        ))}
      </div>
    </section>
  );
};
