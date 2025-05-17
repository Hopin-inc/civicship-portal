"use client";

import { useActivityDetails } from "@/app/activities/[id]/hooks/useActivityDetails";
import ActivityDetailsHeader from "@/app/activities/[id]/components/ActivityDetailsHeader";
import ActivityDetailsContent from "@/app/activities/[id]/components/ActivityDetailsContent";
import ActivityDetailsFooter from "@/app/activities/[id]/components/ActivityDetailsFooter";
import { ErrorState } from "@/components/shared/ErrorState";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { NavigationButtons } from "@/components/shared/NavigationButtons";

interface ActivityPageProps {
  params: {
    id: string;
  };
  searchParams: {
    community_id?: string;
  };
}

export default function ActivityPage({ params, searchParams }: ActivityPageProps) {
  const { id } = params;

  const { opportunity, sameStateActivities, availableTickets, sortedSlots, isLoading, error } =
    useActivityDetails(id);

  const headerConfig = useMemo(
    () => ({
      hideHeader: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  if (error && !opportunity) {
    return <ErrorState message={`Error: ${error.message}`} />;
  }
  if (!opportunity) {
    return <ErrorState message="No opportunity found" />;
  }

  return (
    <>
      {isLoading && <LoadingIndicator fullScreen />}
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
            communityId={searchParams.community_id}
          />
        </div>
      </main>
      <ActivityDetailsFooter
        opportunityId={opportunity.id}
        price={opportunity.feeRequired || 0}
        communityId={searchParams.community_id}
      />
    </>
  );
}
