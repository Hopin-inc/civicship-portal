"use client";

import { useActivityDetails } from "@/app/activities/[id]/hooks/useActivityDetails";
import ActivityDetailsHeader from "@/app/activities/[id]/components/ActivityDetailsHeader";
import ActivityDetailsContent from "@/app/activities/[id]/components/ActivityDetailsContent";
import ActivityDetailsFooter from "@/app/activities/[id]/components/ActivityDetailsFooter";
import { ErrorState } from "@/components/shared/ErrorState";
import { useEffect, useMemo } from "react";
import { useLoading } from "@/hooks/useLoading";
import { useHierarchicalNavigation } from "@/hooks/useHierarchicalNavigation";
import ActivityNavigationButtons from "@/app/activities/[id]/components/ActivityNavigationButtons";
import useHeaderConfig from "@/hooks/useHeaderConfig";

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

  const { setIsLoading } = useLoading();
  const { navigateBack } = useHierarchicalNavigation();

  const headerConfig = useMemo(
    () => ({
      hideHeader: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  if (error && !opportunity) {
    return <ErrorState message={`Error: ${error.message}`} />;
  }
  if (!opportunity) {
    return <ErrorState message="No opportunity found" />;
  }

  return (
    <>
      <ActivityNavigationButtons title={opportunity.title} onBack={navigateBack} />

      <main className="min-h-screen pb-24">
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
      <ActivityDetailsFooter opportunityId={opportunity.id} price={opportunity.feeRequired || 0} />
    </>
  );
}
