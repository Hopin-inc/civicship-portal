"use client";

import SameStateActivities from "@/app/activities/[id]/components/SimilarActivitiesList";
import CompletionHeader from "@/app/reservation/complete/components/CompletionHeader";
import React, { useEffect, useMemo, useRef } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useSearchParams } from "next/navigation";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { useCompletePageViewModel } from "@/app/reservation/complete/hooks/useCompletePageViewModel";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import OpportunityInfo from "@/app/reservation/confirm/components/OpportunityInfo";
import { useOpportunityDetail } from "@/app/activities/[id]/hooks/useOpportunityDetail";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";

export default function CompletePage() {
  const headerConfig: HeaderConfig = useMemo(
    () => ({
      showLogo: true,
      showBackButton: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const track = useAnalytics();

  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("id");
  const reservationId = searchParams.get("reservation_id");
  const guest = searchParams.get("guests");
  const participationCount = guest ? parseInt(guest) : 1;

  const {
    reservation,
    opportunity,
    dateTimeInfo,
    articleCard,
    sameStateActivities,
    loading,
    error,
    refetch,
  } = useCompletePageViewModel(opportunityId, reservationId);
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    if (!reservation || !opportunity || !dateTimeInfo) return;

    track({
      name: "apply_opportunity",
      params: {
        reservationId: reservation.id,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        category: opportunity.category,
        guest: dateTimeInfo.participantCount,
        paidGuest: dateTimeInfo.paidParticipantCount,
        feeRequired: opportunity.feeRequired ?? 0,
        totalFee: dateTimeInfo.totalPrice,
        scheduledAt: dateTimeInfo.startTime,
      },
    });
  }, [reservation, opportunity, dateTimeInfo, track]);

  // #NOTE: query でまとめて取得したいが、一時的対応
  const { opportunity: oppotunityDetail } = useOpportunityDetail(opportunityId ?? "");

  if (loading) return <LoadingIndicator fullScreen />;
  if (error || !reservation || !opportunity || !dateTimeInfo || !oppotunityDetail)
    return <ErrorState title="申込完了ページを読み込めませんでした" refetchRef={refetchRef} />;

  return (
    <main className="flex flex-col items-center">
      <CompletionHeader requireApproval={ oppotunityDetail?.requireApproval } />
      { oppotunityDetail && (
        <OpportunityInfo
          opportunity={ oppotunityDetail }
          dateTimeInfo={ dateTimeInfo }
          participationCount={ participationCount }
          phoneNumber={ reservation.opportunitySlot?.opportunity?.createdByUser?.phoneNumber }
          comment={ reservation.comment }
          totalPrice={ dateTimeInfo.totalPrice }
          ticketCount={ dateTimeInfo.ticketCount }
        />
      ) }
      { opportunityId && sameStateActivities.length > 0 && (
        <>
          <div className="h-2 bg-border -mx-6 w-full" />
          <div className="px-6 w-full">
            <SameStateActivities
              header="近くでおすすめの関わり"
              opportunities={sameStateActivities}
              currentOpportunityId={opportunityId}
            />
          </div>
        </>
      )}
    </main>
  );
}
