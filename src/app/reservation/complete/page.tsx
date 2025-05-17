"use client";

import SameStateActivities from "@/app/activities/[id]/components/SimilarActivitiesList";
import CompletionHeader from "@/app/reservation/complete/components/CompletionHeader";
import ReservationDetails from "@/app/reservation/complete/components/ReservationDetails";
import React, { useEffect, useMemo, useRef } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useSearchParams } from "next/navigation";
import { HeaderConfig } from "@/contexts/HeaderContext";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { useCompletePageViewModel } from "@/app/reservation/complete/hooks/useCompletePageViewModel";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";

export default function CompletePage() {
  const headerConfig: HeaderConfig = useMemo(
    () => ({
      showLogo: true,
      showBackButton: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("id");
  const reservationId = searchParams.get("reservation_id");

  const { reservation, opportunity, dateTimeInfo, sameStateActivities, loading, error, refetch } =
    useCompletePageViewModel(opportunityId, reservationId);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading) return <LoadingIndicator fullScreen />;
  if (error || !reservation || !opportunity || !dateTimeInfo)
    return <ErrorState title="申込完了ページを読み込めませんでした" refetchRef={refetchRef} />;

  return (
    <main className="flex flex-col items-center px-4 pb-8">
      <CompletionHeader />
      {opportunity && <OpportunityCardHorizontal opportunity={opportunity} />}
      {dateTimeInfo && opportunity && (
        <ReservationDetails
          formattedDate={dateTimeInfo.formattedDate}
          startTime={dateTimeInfo.startTime}
          endTime={dateTimeInfo.endTime}
          participantCount={dateTimeInfo.participantCount}
          totalPrice={dateTimeInfo.totalPrice}
          pricePerPerson={opportunity.feeRequired ?? 0}
        />
      )}
      {opportunityId && (
        <div className="w-full mt-8 mb-16">
          <SameStateActivities
            header="おすすめの体験"
            opportunities={sameStateActivities}
            currentOpportunityId={opportunityId}
          />
        </div>
      )}
    </main>
  );
}
