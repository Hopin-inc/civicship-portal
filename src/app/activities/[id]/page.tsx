"use client";

import { useActivityDetails } from "@/hooks/features/activity/useActivityDetails";
import ActivityDetailsHeader from "@/components/features/activity/ActivityDetailsHeader";
import ActivityDetailsContent from "@/components/features/activity/ActivityDetailsContent";
import ActivityDetailsFooter from "@/components/features/activity/ActivityDetailsFooter";
import { ErrorState } from "@/components/shared/ErrorState";
import { useEffect, useMemo } from "react";
import { useLoading } from "@/hooks/core/useLoading";
import { useHeaderConfig } from "@/hooks/core/useHeaderConfig";
import { useHierarchicalNavigation } from "@/hooks/core/useHierarchicalNavigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const { opportunity, similarActivities, availableTickets, availableDates, loading, error } =
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
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  if (error && !opportunity) {
    return <ErrorState message={`Error: ${error.message}`} />;
  }
  if (!opportunity) {
    return <ErrorState message="No opportunity found" />;
  }

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={navigateBack}
          variant="secondary"
          size="icon"
          className="rounded-full shadow-md"
          aria-label="戻る"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <main className="min-h-screen pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <ActivityDetailsHeader opportunity={opportunity} availableTickets={availableTickets} />
          <ActivityDetailsContent
            opportunity={opportunity}
            availableTickets={availableTickets}
            availableDates={availableDates}
            similarActivities={similarActivities}
            communityId={searchParams.community_id}
          />
        </div>
      </main>
      <ActivityDetailsFooter opportunityId={opportunity.id} price={opportunity.feeRequired || 0} />
    </>
  );
}
