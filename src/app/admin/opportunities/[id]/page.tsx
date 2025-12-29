"use client";

import { ErrorState } from "@/components/shared";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import NavigationButtons from "@/components/shared/NavigationButtons";
import { useGetOpportunityQuery, GqlSortDirection, GqlOpportunitySlotHostingStatus } from "@/types/graphql";
import { notFound, useParams } from "next/navigation";
import { useMemo, useRef } from "react";
import OpportunityDetailsHeader from "@/app/opportunities/[id]/components/OpportunityDetailsHeader";
import { OpportunityDetailsContent } from "@/app/opportunities/[id]/components/OpportunityDetailsContent";
import { AdminOpportunityDetailsFooter } from "@/app/opportunities/[id]/components/AdminOpportunityDetailsFooter";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { isActivityCategory, isQuestCategory } from "@/components/domains/opportunities/types";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { presenterActivityDetail, presenterQuestDetail } from "@/components/domains/opportunities/data/presenter";
import { GqlOpportunityCategory } from "@/types/graphql";

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

  const refetchRef = useRef<(() => void) | null>(null);

  // 募集データ取得（編集ページと同じパターン）
  const { data, loading, error, refetch } = useGetOpportunityQuery({
    variables: {
      id: id,
      permission: { communityId: COMMUNITY_ID },
      slotSort: { startsAt: GqlSortDirection.Asc },
      slotFilter: { hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled] },
    },
    fetchPolicy: "network-only",
  });

  // データ整形
  const opportunity = useMemo(() => {
    if (!data?.opportunity) return null;
    const opp = data.opportunity;
    if (opp.category === GqlOpportunityCategory.Activity) {
      return presenterActivityDetail(opp);
    }
    if (opp.category === GqlOpportunityCategory.Quest) {
      return presenterQuestDetail(opp);
    }
    return null;
  }, [data?.opportunity]);

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
          <OpportunityDetailsHeader opportunity={opportunity} availableTickets={0} />
          <OpportunityDetailsContent
            opportunity={opportunity}
            availableDates={opportunity.slots || []}
            sameStateActivities={[]}
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
