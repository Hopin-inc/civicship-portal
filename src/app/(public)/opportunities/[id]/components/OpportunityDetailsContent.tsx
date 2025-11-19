"use client";

import React from "react";
import {
  ActivityCard,
  ActivityDetail,
  isActivityCategory,
  isQuestCategory,
  QuestCard,
  QuestDetail,
} from "@/components/domains/opportunities/types";
import { ActivitySlot, QuestSlot } from "@/app/(authed)/reservation/data/type/opportunitySlot";
import { SimilarOpportunities } from "./SimilarOpportunitiesList";
import { OpportunityBodySection } from "./OpportunityContent/OpportunityBodySection";
import { HostInfoSection } from "./OpportunityContent/HostInfoSection";
import { ScheduleSection } from "./OpportunityContent/ScheduleSection";
import { NoticeSection } from "./OpportunityContent/NoticeSection";
import { PlaceSection } from "./OpportunityContent/PlaceSection";
import { GqlOpportunityCategory } from "@/types/graphql";

interface OpportunityDetailsContentProps {
  opportunity: ActivityDetail | QuestDetail;
  availableDates: (ActivitySlot | QuestSlot)[];
  sameStateActivities: ActivityCard[] | QuestCard[];
  communityId?: string;
}

const getTitle = (category: GqlOpportunityCategory): {title: string, hostLabel: string} => {
  switch (category) {
    case GqlOpportunityCategory.Activity:
      return {title: "体験できること", hostLabel: "案内人"};
    case GqlOpportunityCategory.Quest:
      return {title: "助けてもらいたいこと", hostLabel: "依頼人"};
    default:
      return {title: "", hostLabel: ""};
  }
}

export const OpportunityDetailsContent = ({
  opportunity,
  availableDates,
  sameStateActivities,
  communityId = "",
}: OpportunityDetailsContentProps) => {
  const bodyText = opportunity.description + "\n\n" + opportunity.body;
  return (
    <>
      <OpportunityBodySection body={bodyText} title={getTitle(opportunity.category).title} />
      <HostInfoSection host={opportunity.host} hostLabel={getTitle(opportunity.category).hostLabel} />
      {opportunity.place?.name && opportunity.place?.address && (
        <PlaceSection place={opportunity.place} />
      )}
      <ScheduleSection
        slots={availableDates}
        opportunityId={opportunity.id}
        communityId={communityId}
        place={isActivityCategory(opportunity) ? opportunity.feeRequired : null}
        points={isQuestCategory(opportunity) ? opportunity.pointsToEarn : null}
        pointsRequired={isActivityCategory(opportunity) ? opportunity.pointsRequired : null}
      />
      <NoticeSection />
      <SimilarOpportunities
        header={"近くでおすすめの体験"}
        opportunities={sameStateActivities}
        currentOpportunityId={opportunity.id}
      />
    </>
  );
};





