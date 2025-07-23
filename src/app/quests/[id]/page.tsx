"use client";

import { useEffect, useMemo, useRef } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import NavigationButtons from "@/components/shared/NavigationButtons";
import { notFound, useParams, useSearchParams } from "next/navigation";
import ErrorState from "@/components/shared/ErrorState";
import { QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { Content, Footer, Header } from "./components";
import { DisableReasonType } from "./types";
import { useActivityDetails } from "@/app/activities/[id]/hooks/useActivityDetails";
import { GqlOpportunityCategory } from "@/types/graphql";
import { QuestCard, QuestDetail } from "@/app/activities/data/type";

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

  const isQuestDetail = (opportunity: any): opportunity is QuestDetail => {
    return opportunity?.category === GqlOpportunityCategory.Quest;
  };

  if (!opportunity || !isQuestDetail(opportunity)) {
    return notFound();
  }

  console.log("opportunity", opportunity);

  const questSlots = sortedSlots?.filter((slot): slot is QuestSlot => "pointsToEarn" in slot) ?? [];
  const questQuests = sameStateActivities?.filter((quest): quest is QuestCard => "pointsToEarn" in quest && !("feeRequired" in quest)) ?? [];

  const getDisableReason = (
    slots: QuestSlot[] | null | undefined,
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
          <Header opportunity={opportunity} />
          <Content
            opportunity={opportunity}
            availableTickets={availableTickets}
            availableDates={questSlots}
            sameStateActivities={questQuests}
            communityId={communityId}
            // isExternalBooking={isExternalBooking}
          />
        </div>
      </main>
      <Footer
        opportunityId={opportunity.id}
        point={opportunity.pointsToEarn}
        communityId={communityId}
        disableReason={getDisableReason(questSlots, isExternalBooking, opportunity.isReservable)}
      />
    </>
  );
}
