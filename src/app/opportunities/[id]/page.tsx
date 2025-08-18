"use client";

import { DisableReasonType } from "@/app/opportunities/[id]/types";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { ErrorState } from "@/components/shared";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import NavigationButtons from "@/components/shared/NavigationButtons";
import { useAuth } from "@/contexts/AuthProvider";
import { useOpportunityContext } from "@/hooks/opportunities/useOpportunityContext";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import OpportunityDetailsHeader from "./components/OpportunityDetailsHeader";
import { OpportunityDetailsContent } from "./components/OpportunityDetailsContent";
import { OpportunityDetailsFooter } from "./components/OpportunityDetailsFooter";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { isActivityCategory, isQuestCategory } from "@/components/domains/opportunities/types";

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const community_id = Array.isArray(params.community_id) ? params.community_id[0] : params.community_id;
  const headerConfig = useMemo(
    () => ({
      hideHeader: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);
  const { user } = useAuth();
  const {
    opportunity,
    sameStateOpportunities,
    availableTickets,
    sortedSlots,
    loading,
    error,
    refetch,
  } = useOpportunityContext(id, user);

  const isExternalBooking =
  (opportunity?.title.includes("予約") || opportunity?.title.includes("問い合わせ")) ?? false;

  const refetchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading) return <LoadingIndicator />;

  if (error) return <ErrorState title="募集ページを読み込めませんでした"  refetchRef={refetchRef}/>;

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
        price={isActivityCategory(opportunity) ? opportunity.feeRequired : null}
        point={isQuestCategory(opportunity) ? opportunity.pointsToEarn : null}
        communityId={community_id}
        disableReason={getDisableReason(sortedSlots, isExternalBooking, opportunity.isReservable)}
      />
    </>
  );
}