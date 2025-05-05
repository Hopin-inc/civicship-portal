"use client";

import { useActivityDetails } from "@/hooks/features/activity/useActivityDetails";
import ActivityDetailsHeader from "@/components/features/activity/ActivityDetailsHeader";
import ActivityDetailsContent from "@/components/features/activity/ActivityDetailsContent";
import ActivityDetailsFooter from "@/components/features/activity/ActivityDetailsFooter";
import { ErrorState } from "@/components/shared/ErrorState";
import { useEffect } from "react";
import { useLoading } from "@/hooks/core/useLoading";

interface ActivityPageProps {
  params: {
    id: string;
  };
  searchParams: {
    community_id?: string;
  };
}

export default function ActivityPage({ params, searchParams }: ActivityPageProps) {
  const { 
    opportunity, 
    similarOpportunities, 
    availableTickets, 
    availableDates,
    loading, 
    error 
  } = useActivityDetails({ id: params.id });
  
  const { setIsLoading } = useLoading();
  
  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  if (error) return <ErrorState message={`Error: ${error.message}`} />;
  if (!opportunity) return <ErrorState message="No opportunity found" />;

  return (
    <>
      <main className="min-h-screen pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <ActivityDetailsHeader 
            opportunity={opportunity} 
            availableTickets={availableTickets} 
          />
          
          <ActivityDetailsContent 
            opportunity={opportunity}
            availableTickets={availableTickets}
            availableDates={availableDates}
            similarOpportunities={similarOpportunities}
            communityId={searchParams.community_id}
          />
        </div>
      </main>

      <ActivityDetailsFooter 
        opportunityId={opportunity.id} 
        price={opportunity.feeRequired || 0} 
      />
    </>
  );
}
