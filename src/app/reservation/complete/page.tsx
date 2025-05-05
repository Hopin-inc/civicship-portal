"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import { RecentActivitiesTimeline } from "@/components/features/activity/RecentActivitiesTimeline";
import { SimilarActivitiesList } from "@/components/features/activity/SimilarActivitiesList";
import { CompletionHeader } from "@/components/features/reservation/CompletionHeader";
import { ActivitySummary } from "@/components/features/reservation/ActivitySummary";
import { ReservationDetails } from "@/components/features/reservation/ReservationDetails";
import { useReservationComplete } from "@/hooks/features/reservation/useReservationComplete";

/**
 * Page component for reservation completion
 */
export default function CompletePage() {
  const {
    opportunity,
    similarOpportunities,
    opportunitiesCreatedByHost,
    dateTimeInfo,
    isLoading,
    error
  } = useReservationComplete();

  if (isLoading) {
    return <LoadingIndicator message="読み込み中..." />;
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  if (!opportunity || !dateTimeInfo) {
    return <ErrorState message="予約情報が見つかりませんでした" />;
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
        <RecentActivitiesTimeline opportunities={opportunitiesCreatedByHost} />
      </div>
    </main>
  );
}
