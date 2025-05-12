"use client";

import React from "react";
import { ActivityCard } from "@/app/activities/data/type";
import ActivitiesCarouselSection from "@/app/activities/components/CarouselSection/CarouselSection";

interface SameStateActivitiesProps {
  header: string;
  opportunities: ActivityCard[];
  currentOpportunityId: string;
}

export const SameStateActivities: React.FC<SameStateActivitiesProps> = ({
  header,
  opportunities,
  currentOpportunityId,
}) => {
  const filteredOpportunities = opportunities.filter(
    (opportunity) => opportunity.id !== currentOpportunityId,
  );
  if (filteredOpportunities.length === 0) return null;
  return <ActivitiesCarouselSection title={header} opportunities={filteredOpportunities} />;
};
