"use client";

import React from "react";
import OpportunityCardVertical from "@/app/activities/components/Card/CardVertical";
import { ActivityCard } from "@/app/activities/data/type";
import CarouselSectionSkeleton from "@/app/activities/components/CarouselSection/CarouselSectionSkeleton";

interface ActivitiesCarouselSectionProps {
  title: string;
  opportunities: ActivityCard[];
  isInitialLoading?: boolean;
}

const ActivitiesCarouselSection: React.FC<ActivitiesCarouselSectionProps> = ({
  title,
  opportunities,
  isInitialLoading = false,
}) => {
  if (isInitialLoading) return <CarouselSectionSkeleton title={title} />;
  if (opportunities.length === 0) return null;

  return (
    <section className="mt-12 px-6">
      <h2 className="text-display-md">{title}</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
        {opportunities.map((opportunity) => (
          <OpportunityCardVertical key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </section>
  );
};

export default ActivitiesCarouselSection;
