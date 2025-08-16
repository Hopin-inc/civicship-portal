"use client";

import { DisableReasonType } from "@/app/opportunities/[id]/types";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { ErrorState } from "@/components/shared";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import NavigationButtons from "@/components/shared/NavigationButtons";
import { useAuth } from "@/contexts/AuthProvider";
import { useOpportunityDetail } from "@/hooks/opportunities/useOpportunityDetail";
import { notFound } from "next/navigation";
import { use, useEffect, useMemo, useRef } from "react";
import OpportunityDetailsHeader from "./components/OpportunityDetailsHeader";
import { OpportunityDetailsContent } from "./components/OpportunityDetailsContent";
import { OpportunityDetailsFooter } from "./components/OpportunityDetailsFooter";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string, community_id: string }> }) {
  const headerConfig = useMemo(
    () => ({
      hideHeader: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);
  const { id,community_id } = use(params);
  const { user } = useAuth();
  const {
    opportunity,
    sameStateOpportunities,
    availableTickets,
    sortedSlots,
    loading,
    error,
    refetch,
  } = useOpportunityDetail(id, user);

  const isExternalBooking =
  (opportunity?.title.includes("予約") || opportunity?.title.includes("問い合わせ")) ?? false;

  const refetchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading) return <LoadingIndicator />;

  if (error) return <ErrorState title="募集ページを読み込めませんでした"  />;

  if (!opportunity) return notFound();

  const getDisableReason = (
    slots: (ActivitySlot | QuestSlot)[] | null | undefined,
    isExternalBooking: boolean,
    isReservable: boolean,
  ): DisableReasonType | undefined => {
    if (isExternalBooking) return "externalBooking";
    if (!slots || slots.length === 0) return "noSlots";
    if (!isReservable) return "reservationClosed";
    return undefined;
  };
  

  return (
    <>
      <div className="relative max-w-mobile-l mx-auto w-full">
        <NavigationButtons title={opportunity.title} />
      </div>
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
            <OpportunityDetailsHeader opportunity={opportunity} availableTickets={availableTickets.length} />
            <OpportunityDetailsContent 
                opportunity={opportunity} 
                availableDates={sortedSlots}
                sameStateActivities={sameStateOpportunities}
                communityId={community_id}
            />
        </div>
      </main>
      <OpportunityDetailsFooter
        opportunityId={opportunity.id}
        price={"feeRequired" in opportunity ? opportunity.feeRequired : null}
        point={"pointsToEarn" in opportunity ? opportunity.pointsToEarn : null}
        communityId={community_id}
        disableReason={getDisableReason(sortedSlots, isExternalBooking, opportunity.isReservable)}
      />
    </>
  );
}