"use client";

import { SameStateActivities } from "@/app/activities/[id]/components/SimilarActivitiesList";
import { CompletionHeader } from "@/app/reservation/components/CompletionHeader";
import { ActivitySummary } from "@/app/reservation/components/ActivitySummary";
import { ReservationDetails } from "@/app/reservation/components/ReservationDetails";
import { useReservationComplete } from "@/app/reservation/complete/hooks/useReservationComplete";
import React, { useMemo } from "react";
import { ReservationContentGate } from "@/app/reservation/contentGate";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useSearchParams } from "next/navigation";
import {
  presenterActivityDetail,
  presenterReservationDateTimeInfo,
} from "@/app/activities/data/presenter";
import { useSameStateActivities } from "@/app/activities/[id]/hooks/useSameStateActivities";

export default function CompletePage() {
  useHeaderConfig({ showLogo: true });

  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("opportunity_id");
  const reservationId = searchParams.get("reservation_id");

  const {
    reservation,
    gqlOpportunity,
    gqlOpportunitySlot,
    loading: reservationLoading,
    error: reservationError,
  } = useReservationComplete(reservationId);

  const opportunity = useMemo(() => {
    return gqlOpportunity ? presenterActivityDetail(gqlOpportunity) : null;
  }, [gqlOpportunity]);

  const dateTimeInfo = useMemo(() => {
    if (!reservation || !gqlOpportunity || !gqlOpportunitySlot) return null;
    return presenterReservationDateTimeInfo(gqlOpportunitySlot, gqlOpportunity, reservation);
  }, [reservation, gqlOpportunity, gqlOpportunitySlot]);

  const stateCode = gqlOpportunity?.place?.city?.state?.code ?? "";
  const {
    sameStateActivities,
    loading: sameStateLoading,
    error: sameStateError,
  } = useSameStateActivities(opportunityId ?? "", stateCode);

  const isLoading = reservationLoading || sameStateLoading;
  const error = reservationError ?? sameStateError ?? null;

  return (
    <ReservationContentGate
      loading={isLoading}
      error={error}
      nullChecks={[
        { label: "予約情報", value: opportunity },
        { label: "日付情報", value: dateTimeInfo },
      ]}
    >
      <main className="flex flex-col items-center px-4 pb-8">
        <CompletionHeader />
        <ActivitySummary opportunity={opportunity!} />
        <ReservationDetails
          formattedDate={dateTimeInfo!.formattedDate}
          startTime={dateTimeInfo!.startTime}
          endTime={dateTimeInfo!.endTime}
          participantCount={dateTimeInfo!.participantCount}
          totalPrice={dateTimeInfo!.totalPrice}
          pricePerPerson={opportunity!.feeRequired || 0}
        />
        <div className="w-full mt-8 mb-16">
          <SameStateActivities
            header="おすすめの体験"
            opportunities={sameStateActivities}
            currentOpportunityId={opportunity!.id}
          />
        </div>
      </main>
    </ReservationContentGate>
  );
}
