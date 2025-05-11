"use client";

import { SimilarActivitiesList } from "@/components/features/activity/SimilarActivitiesList";
import { CompletionHeader } from "@/components/features/reservation/CompletionHeader";
import { ActivitySummary } from "@/components/features/reservation/ActivitySummary";
import { ReservationDetails } from "@/components/features/reservation/ReservationDetails";
import { useReservationComplete } from "@/hooks/features/reservation/useReservationComplete";
import React from "react";
import { ReservationContentGate } from "@/app/reservation/contentGate";

export default function CompletePage() {
  const result = useReservationComplete();

  return (
    <ReservationContentGate
      loading={result.isLoading}
      error={result.error}
      nullChecks={[
        { label: "予約情報", value: result.opportunity },
        { label: "日付情報", value: result.dateTimeInfo },
      ]}
    >
      <ReservationCompletionUI {...result} />
    </ReservationContentGate>
  );
}

function ReservationCompletionUI({
   opportunity,
   similarOpportunities,
   // opportunitiesCreatedByHost,
   dateTimeInfo,
 }: ReturnType<typeof useReservationComplete>) {
  if (!opportunity || !dateTimeInfo) {
    throw new Error("ReservationCompletionUI should only be rendered when opportunity and dateTimeInfo are present");
  }
  return (
    <main className="flex flex-col items-center px-4 pb-8">
      <CompletionHeader />

      <ActivitySummary opportunity={opportunity} />

      <ReservationDetails
        formattedDate={dateTimeInfo.formattedDate}
        startTime={dateTimeInfo.startTime}
        endTime={dateTimeInfo.endTime}
        participantCount={dateTimeInfo.participantCount}
        totalPrice={dateTimeInfo.totalPrice}
        pricePerPerson={opportunity.feeRequired || 0}
      />

      <div className="w-full mt-8 mb-16">
        <SimilarActivitiesList
          opportunities={similarOpportunities}
          currentOpportunityId={opportunity.id}
        />
        {/*<RecentActivitiesTimeline opportunities={opportunitiesCreatedByHost} />*/}
      </div>
    </main>
  );
}
