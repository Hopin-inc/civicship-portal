"use client";

import SameStateActivities from "@/app/activities/[id]/components/SimilarActivitiesList";
import CompletionHeader from "@/app/reservation/complete/components/CompletionHeader";
import ReservationDetails from "@/app/reservation/complete/components/ReservationDetails";
import React, { useEffect, useMemo, useRef } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useSearchParams } from "next/navigation";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { useCompletePageViewModel } from "@/app/reservation/complete/hooks/useCompletePageViewModel";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import OpportunityInfo from "@/app/reservation/confirm/components/OpportunityInfo";
import { useOpportunityDetail } from "@/app/activities/[id]/hooks/useOpportunityDetail";
import ArticleCard from "@/app/articles/components/Card";
import { useArticles } from "@/app/articles/hooks/useArticles";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";

export default function CompletePage() {
  const headerConfig: HeaderConfig = useMemo(
    () => ({
      showLogo: true,
      showBackButton: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const track = useAnalytics();

  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("id");
  const reservationId = searchParams.get("reservation_id");
  const guest = searchParams.get("guests");
  const participationCount = guest ? parseInt(guest) : 1;

  const { reservation, opportunity, dateTimeInfo, sameStateActivities, loading, error, refetch } =
    useCompletePageViewModel(opportunityId, reservationId);
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    if (!reservation || !opportunity || !dateTimeInfo) return;

    track({
      name: "apply_opportunity",
      params: {
        reservationId: reservation.id,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        category: opportunity.category,
        guest: dateTimeInfo.participantCount,
        feeRequired: opportunity.feeRequired ?? 0,
        totalFee: dateTimeInfo.totalPrice,
        scheduledAt: dateTimeInfo.startTime,
      },
    });
  }, [reservation, opportunity, dateTimeInfo, track]);

  // #NOTE: query でまとめて取得したいが、一時的対応
  const { opportunity: oppotunityDetail } = useOpportunityDetail(opportunityId ?? "");

  // 記事データを取得*(同じく query でまとめて取得したいが、一時的対応
  const { articles, loading: articlesLoading } = useArticles();
  // 最新の記事を取得（存在する場合）
  const latestArticle = useMemo(() => (articles.length > 0 ? articles[0] : null), [articles]);

  if (loading) return <LoadingIndicator fullScreen />;
  if (error || !reservation || !opportunity || !dateTimeInfo)
    return <ErrorState title="申込完了ページを読み込めませんでした" refetchRef={refetchRef} />;

  return (
    <main className="flex flex-col items-center">
      <CompletionHeader />
      {oppotunityDetail && <OpportunityInfo opportunity={oppotunityDetail} />}
      {dateTimeInfo && opportunity && (
        <div className="px-6 w-full">
          <ReservationDetails
            formattedDate={dateTimeInfo.formattedDate}
            startTime={dateTimeInfo.startTime}
            endTime={dateTimeInfo.endTime}
            participantCount={participationCount}
            totalPrice={dateTimeInfo.totalPrice}
            pricePerPerson={opportunity.feeRequired ?? 0}
            location={oppotunityDetail?.place}
            phoneNumber={reservation.createdByUser?.phoneNumber}
            isReserved={true}
          />
        </div>
      )}
      {articlesLoading || latestArticle ? (
        <>
          <div className="h-2 bg-border -mx-6 w-full" />
          <div className="px-6 w-full pt-6 pb-8 max-w-mobile-l mx-auto space-y-4">
            <h2 className="text-display-md mb-4">依頼人の想い</h2>
            {articlesLoading ? (
              <div className="py-4">
                <LoadingIndicator />
              </div>
            ) : latestArticle ? (
              <ArticleCard article={latestArticle} showUser />
            ) : (
              <p className="text-body-md text-caption">関連記事はありません</p>
            )}
          </div>
        </>
      ) : null}
      {opportunityId && sameStateActivities.length > 0 && (
        <>
          <div className="h-2 bg-border -mx-6 w-full" />
          <div className="px-6 w-full">
            <SameStateActivities
              header="近くでおすすめの関わり"
              opportunities={sameStateActivities}
              currentOpportunityId={opportunityId}
            />
          </div>
        </>
      )}
    </main>
  );
}
