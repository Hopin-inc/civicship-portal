"use client";

import React from "react";
import SameStateActivities from "./SimilarActivitiesList";
import { ActivityCard, ActivityDetail } from "@/app/activities/data/type";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { BodySection } from "@/app/quests/[id]/components/BodySection";
import { HostInfoSection, NoticeSection, PlaceSection, ScheduleSection } from "./sections";

interface ActivityDetailsContentProps {
  opportunity: ActivityDetail;
  availableTickets: number;
  availableDates: ActivitySlot[];
  sameStateActivities: ActivityCard[];
  communityId?: string;
}

export const Content = ({
  opportunity,
  availableTickets,
  availableDates,
  sameStateActivities,
  communityId = "",
}: ActivityDetailsContentProps) => {
  return (
    <>
      <BodySection body={opportunity.description + "\n\n" + opportunity.body} />
      <HostInfoSection host={opportunity.host} />
      <PlaceSection place={opportunity.place} />
      <ScheduleSection
        slots={availableDates}
        opportunityId={opportunity.id}
        communityId={communityId}
      />
      <NoticeSection />
      <SameStateActivities
        header={"近くでおすすめの体験"}
        opportunities={sameStateActivities}
        currentOpportunityId={opportunity.id}
      />
    </>
  );
};





