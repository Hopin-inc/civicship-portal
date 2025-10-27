"use client";

import { useEffect, useMemo, useRef } from "react";
import OpportunitiesGridListSection from "@/components/domains/opportunities/components/ListSection/OpportunitiesGridListSection";
import { mapOpportunityCards } from "@/components/domains/opportunities/data/presenter";
import { ErrorState } from "@/components/shared";
import EmptyState from "@/components/shared/EmptyState";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Coins } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFeatureCheck } from "@/hooks/useFeatureCheck";
import { formatOpportunities } from "@/components/domains/opportunities/utils";
import { useFetchFeedOpportunities } from "../hooks/useFetchFeedOpportunities";

export default function OpportunitiesFeed() {
  const { opportunities, loading, error, loadMoreRef, refetch } = useFetchFeedOpportunities();
  const router = useRouter();
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const allCards = mapOpportunityCards(opportunities.edges ?? []);
  const firstFour = allCards.slice(0, 4);
  const afterFour = allCards.slice(4);
  const isEmpty = !loading && opportunities?.edges?.length === 0;
  const shouldShowQuests = useFeatureCheck("quests");

  const firstFourFormatOpportunities = firstFour.map(formatOpportunities);
  const afterFourFormatOpportunities = afterFour.map(formatOpportunities);

  const headerConfig = useMemo(
    () => ({
      showLogo: true,
      showSearchForm: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  if (error) {
    return <ErrorState title="募集一覧を読み込めませんでした" refetchRef={refetchRef} />;
  }

  if (isEmpty) {
    return <EmptyState title="募集" />;
  }

  return (
    <div className="min-h-screen">
      <OpportunitiesGridListSection
        opportunities={firstFourFormatOpportunities}
        isInitialLoading={false}
        isSectionLoading={loading}
        opportunityTitle="すべての体験"
      />
      {shouldShowQuests && (
      <div className="px-6">
        <button
          className="w-full flex bg-blue-50 rounded-lg p-4 appearance-none border-none focus:outline-none box-border"
          onClick={() => {
            router.push("/opportunities/search?type=quest");
          }}
        >
          <div>
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <div className="ml-2">
            <div className="flex justify-between">
              <p className="text-base font-bold text-left">ポイントを獲得すると、<br/>無料で体験に参加できます。</p>
              <Image src="/icons/arrow.svg" alt="arrow" width={32} height={32} className="mt-6 ml-4"/>
            </div>
            <span className="text-xs">ポイントがもらえるお手伝いを探してみましょう</span>
            </div>
          </button>
        </div>
      )}
      <OpportunitiesGridListSection
        opportunities={afterFourFormatOpportunities}
        isInitialLoading={false}
        isSectionLoading={loading}
        isTitle={false}
        opportunityTitle="すべての体験"
      />
      <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
    </div>
  );
}
