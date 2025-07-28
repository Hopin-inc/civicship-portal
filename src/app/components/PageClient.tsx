"use client";

import { useEffect, useMemo, useRef } from "react";
import { useActivities } from "@/app/activities/hooks/useActivities";
import ActivitiesListSection from "@/app/activities/components/ListSection/ListSection";
import { mapOpportunityCards } from "@/app/activities/data/presenter";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Coins } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFeatureCheck } from "@/hooks/useFeatureCheck";

export default function PageClient() {
  const { opportunities, loading, error, loadMoreRef, refetch } = useActivities();
  const router = useRouter();
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const allCards = mapOpportunityCards(opportunities.edges ?? []);
  const firstFour = allCards.slice(0, 4);
  const afterFour = allCards.slice(4);
  const isFirstLoaded = !loading && opportunities?.edges?.length > 0;
  const isEmpty = !loading && opportunities?.edges?.length === 0;
  const shouldShowQuests = useFeatureCheck("quests");

  // if (!isFirstLoaded && loading) {
  //   return (
  //     <div className="min-h-screen pb-16">
  //       <ListSectionSkeleton />
  //     </div>
  //   );
  // }

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
    <div className="min-h-screen ">
      {/* 最初の4件 */}
      <ActivitiesListSection
        opportunities={firstFour}
        isInitialLoading={false}
        isSectionLoading={loading}
      />
      {/* バナー */}
      {shouldShowQuests && (
      <div className="px-6">
        <button
          className="w-full flex bg-blue-50 rounded-lg p-4 appearance-none border-none focus:outline-none"
          style={{ boxSizing: 'border-box' }}
          onClick={() => {
            router.push("/quests");
          }}
        >
          <div>
            <Coins className="w-8 h-8 text-primary" />
          </div>
          <div className="ml-2">
            <div className="flex justify-between">
              <p className="text-base font-bold text-left">ポイントを獲得すると、<br/>無料で体験に参加できます。</p>
              <Image src={"icons/arrow.svg"} alt="arrow" width={32} height={32} className="mt-6 ml-4"/>
            </div>
            <span className="text-xs">ポイントがもらえるお手伝いを探してみましょう</span>
            </div>
          </button>
        </div>
      )}
      {/* 5件目以降 */}
      <ActivitiesListSection
        opportunities={afterFour}
        isInitialLoading={false}
        isSectionLoading={loading}
        isTitle={false}
      />
      <div ref={loadMoreRef} className="h-10" aria-hidden="true" />
    </div>
  );
}
