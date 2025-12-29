"use client";

import { ErrorState } from "@/components/shared";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import NavigationButtons from "@/components/shared/NavigationButtons";
import { useAuth } from "@/contexts/AuthProvider";
import { useOpportunityDetails } from "@/hooks/opportunities/useOpportunityDetails";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import OpportunityDetailsHeader from "@/app/opportunities/[id]/components/OpportunityDetailsHeader";
import { OpportunityDetailsContent } from "@/app/opportunities/[id]/components/OpportunityDetailsContent";
import { AdminOpportunityDetailsFooter } from "@/app/opportunities/[id]/components/AdminOpportunityDetailsFooter";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { isActivityCategory, isQuestCategory } from "@/components/domains/opportunities/types";

export default function AdminOpportunityDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

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
  } = useOpportunityDetails(id, user);

  const refetchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading) return <LoadingIndicator />;

  if (error) return <ErrorState title="募集ページを読み込めませんでした" refetchRef={refetchRef} />;

  if (!opportunity) return notFound();

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
            communityId=""
          />
        </div>
      </main>
      <AdminOpportunityDetailsFooter
        opportunityId={opportunity.id}
        price={isActivityCategory(opportunity) ? opportunity.feeRequired : null}
        point={isQuestCategory(opportunity) ? opportunity.pointsToEarn : null}
        pointsRequired={isActivityCategory(opportunity) ? opportunity.pointsRequired : null}
        publishStatus={opportunity.publishStatus}
        refetch={refetch}
      />
    </>
  );
}
