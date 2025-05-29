"use client";

import { useActivityDetails } from "@/app/activities/[id]/hooks/useActivityDetails";
import ActivityDetailsHeader from "@/app/activities/[id]/components/ActivityDetailsHeader";
import ActivityDetailsContent from "@/app/activities/[id]/components/ActivityDetailsContent";
import ActivityDetailsFooter, {
  DisableReasonType,
} from "@/app/activities/[id]/components/ActivityDetailsFooter";
import { useEffect, useMemo, useRef } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import NavigationButtons from "@/components/shared/NavigationButtons";
import { notFound, useParams, useSearchParams } from "next/navigation";
import ErrorState from "@/components/shared/ErrorState";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";

export default function ActivityPage() {
  const headerConfig = useMemo(
    () => ({
      hideHeader: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const params = useParams();
  const searchParams = useSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const communityId = searchParams.get("community_id") ?? "";
  const {
    opportunity,
    sameStateActivities,
    availableTickets,
    sortedSlots,
    isLoading,
    error,
    refetch,
  } = useActivityDetails(id ?? "");

  // NOTE: LINE で予約しない場合はタイトルに予約、問い合わせを含むようにしているので、タイトルの文字で判断している(NEO88の場合)
  const isExternalBooking =
    (opportunity?.title.includes("予約") || opportunity?.title.includes("問い合わせ")) ?? false;

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (isLoading) return <LoadingIndicator />;

  if (error) {
    return <ErrorState title="募集ページを読み込めませんでした" refetchRef={refetchRef} />;
  }

  if (!opportunity) {
    return notFound();
  }

  const getDisableReason = (
    slots: ActivitySlot[] | null | undefined,
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
          <ActivityDetailsHeader opportunity={opportunity} availableTickets={availableTickets} />
          <ActivityDetailsContent
            opportunity={opportunity}
            availableTickets={availableTickets}
            availableDates={sortedSlots}
            sameStateActivities={sameStateActivities}
            communityId={communityId}
            isExternalBooking={isExternalBooking}
          />
        </div>
      </main>
      <ActivityDetailsFooter
        opportunityId={opportunity.id}
        price={opportunity.feeRequired}
        communityId={communityId}
        disableReason={getDisableReason(sortedSlots, isExternalBooking, opportunity.isReservable)}
      />
    </>
  );
}
