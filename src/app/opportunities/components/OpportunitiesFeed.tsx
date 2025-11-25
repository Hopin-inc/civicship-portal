"use client";

import { useEffect, useMemo, useRef } from "react";
import { mapOpportunityCards } from "@/components/domains/opportunities/data/presenter";
import { ErrorState } from "@/components/shared";
import EmptyState from "@/components/shared/EmptyState";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Coins } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFeatureCheck } from "@/hooks/useFeatureCheck";
import { useFetchFeedOpportunities } from "../hooks/useFetchFeedOpportunities";
import { groupCardsByDate } from "@/app/search/data/presenter";
import DateGroupedOpportunities from "@/app/search/result/components/DateGroupedOpportunities";

export default function OpportunitiesFeed() {
  const { opportunities, loading, error, loadMoreRef, refetch } = useFetchFeedOpportunities();
  const router = useRouter();
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const allCards = mapOpportunityCards(opportunities.edges ?? []);
  const groupedOpportunities = useMemo(() => groupCardsByDate(allCards), [allCards]);
  const isEmpty = !loading && opportunities?.edges?.length === 0;
  const shouldShowQuests = useFeatureCheck("quests");

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
      <DateGroupedOpportunities groupedOpportunities={groupedOpportunities} />
      {shouldShowQuests && (
      <div className="px-6 mt-6">
        <button
          className="w-full flex bg-blue-50 rounded-lg p-4 appearance-none border-none focus:outline-none"
          style={{ boxSizing: 'border-box' }}
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
      {loading && (
        <div className="py-6 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-b-2 border-foreground rounded-full"></div>
        </div>
      )}
      <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
    </div>
  );
}
