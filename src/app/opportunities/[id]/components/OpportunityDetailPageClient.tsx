"use client";

import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import NavigationButtons from "@/components/shared/NavigationButtons";
import { ActivityDetail, QuestDetail } from "@/app/activities/data/type";
import ActivityDetailsHeader from "@/app/activities/[id]/components/ActivityDetailsHeader";
import ActivityDetailsContent from "@/app/activities/[id]/components/ActivityDetailsContent";
import ActivityDetailsFooter from "@/app/activities/[id]/components/ActivityDetailsFooter";

interface OpportunityDetailPageClientProps {
  opportunityDetail: ActivityDetail | QuestDetail | null;
  type: "activity" | "quest";
}

export default function OpportunityDetailPageClient({ 
  opportunityDetail, 
  type 
}: OpportunityDetailPageClientProps) {
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

  const searchParams = useSearchParams();
  const communityId = searchParams.get("community_id") ?? "";

  if (!opportunityDetail) {
    return null;
  }

  return (
    <>
      <div className="relative max-w-mobile-l mx-auto w-full">
        <NavigationButtons title={opportunityDetail.title} />
      </div>

      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <ActivityDetailsHeader opportunity={opportunityDetail} availableTickets={0} />
          <ActivityDetailsContent
            opportunity={opportunityDetail}
            availableTickets={0}
            availableDates={[]}
            sameStateActivities={[]}
            communityId={communityId}
          />
        </div>
      </main>
      <ActivityDetailsFooter
        opportunity={opportunityDetail}
        price={type === "activity" ? (opportunityDetail as any).feeRequired : (opportunityDetail as any).pointsToEarn}
        communityId={communityId}
        disableReason={undefined}
      />
    </>
  );
}
