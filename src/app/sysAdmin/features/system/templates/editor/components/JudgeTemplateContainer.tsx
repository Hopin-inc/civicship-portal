"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useApolloClient } from "@apollo/client";
import {
  GqlReportTemplateKind,
  type GqlGetAdminTemplateFeedbackStatsQuery,
  type GqlGetAdminTemplateFeedbacksQuery,
  type GqlGetAdminTemplateFeedbacksQueryVariables,
  type GqlReportTemplateFieldsFragment,
  type GqlReportTemplateStatsBreakdownRowFieldsFragment,
  type GqlReportVariant,
} from "@/types/graphql";
import { GET_ADMIN_TEMPLATE_FEEDBACKS } from "@/graphql/account/adminTemplateFeedbacks/query";
import { useCursorPagination } from "@/app/sysAdmin/_shared/hooks/useCursorPagination";
import { createEmptyConnection } from "@/app/sysAdmin/_shared/pagination/emptyConnection";
import { stableFilterKey } from "@/app/sysAdmin/_shared/pagination/filterKey";
import { JudgeTemplateView } from "./JudgeTemplateView";
import {
  EMPTY_FEEDBACKS_FILTER,
  type TemplateFeedbacksFilterValue,
} from "./TemplateFeedbacksFilter";

type FeedbacksConnection = NonNullable<
  GqlGetAdminTemplateFeedbacksQuery["adminTemplateFeedbacks"]
>;
type FeedbackStats =
  GqlGetAdminTemplateFeedbackStatsQuery["adminTemplateFeedbackStats"];

type Props = {
  variant: GqlReportVariant;
  initialBreakdownRows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  initialJudgeTemplate: GqlReportTemplateFieldsFragment | null;
  initialFeedbacks: FeedbacksConnection | null;
  initialStats: FeedbackStats | null;
};

const PAGE_SIZE = 20;

const EMPTY_CONNECTION = createEmptyConnection(
  "ReportFeedbacksConnection",
) as FeedbacksConnection;

/**
 * `JudgeTemplateView` (presentational) と SSR initial data + feedback
 * pagination を結ぶ container。
 *
 * JUDGE は閲覧専用のため mutation は使わない。「もっと見る」だけ Apollo
 * client.query で追加ページを取得する。
 */
export function JudgeTemplateContainer({
  variant,
  initialBreakdownRows,
  initialJudgeTemplate,
  initialFeedbacks,
  initialStats,
}: Props) {
  const apollo = useApolloClient();

  const [feedbacksFilter, setFeedbacksFilter] =
    useState<TemplateFeedbacksFilterValue>(EMPTY_FEEDBACKS_FILTER);
  const feedbacksFilterKey = useMemo(
    () => stableFilterKey({ ...feedbacksFilter }),
    [feedbacksFilter],
  );

  const [currentFeedbacks, setCurrentFeedbacks] = useState<FeedbacksConnection>(
    initialFeedbacks ?? EMPTY_CONNECTION,
  );
  const [refetchingFeedbacks, setRefetchingFeedbacks] = useState(false);
  const [feedbacksRefetchError, setFeedbacksRefetchError] =
    useState<unknown>(null);

  useEffect(() => {
    if (feedbacksFilterKey === "") {
      setCurrentFeedbacks(initialFeedbacks ?? EMPTY_CONNECTION);
      setRefetchingFeedbacks(false);
      setFeedbacksRefetchError(null);
      return;
    }
    let cancelled = false;
    setRefetchingFeedbacks(true);
    setFeedbacksRefetchError(null);
    void (async () => {
      try {
        const result = await apollo.query<
          GqlGetAdminTemplateFeedbacksQuery,
          GqlGetAdminTemplateFeedbacksQueryVariables
        >({
          query: GET_ADMIN_TEMPLATE_FEEDBACKS,
          variables: {
            variant,
            kind: GqlReportTemplateKind.Judge,
            feedbackType: feedbacksFilter.feedbackType ?? undefined,
            maxRating: feedbacksFilter.maxRating ?? undefined,
            first: PAGE_SIZE,
          },
          fetchPolicy: "network-only",
        });
        if (cancelled) return;
        setCurrentFeedbacks(
          result.data.adminTemplateFeedbacks ?? EMPTY_CONNECTION,
        );
      } catch (err) {
        if (cancelled) return;
        setCurrentFeedbacks(EMPTY_CONNECTION);
        setFeedbacksRefetchError(err);
      } finally {
        if (!cancelled) setRefetchingFeedbacks(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [feedbacksFilterKey, variant, apollo, feedbacksFilter, initialFeedbacks]);

  const fetchMoreFeedbacks = useCallback(
    async (cursor: string, first: number) => {
      const result = await apollo.query<
        GqlGetAdminTemplateFeedbacksQuery,
        GqlGetAdminTemplateFeedbacksQueryVariables
      >({
        query: GET_ADMIN_TEMPLATE_FEEDBACKS,
        variables: {
          variant,
          kind: GqlReportTemplateKind.Judge,
          feedbackType: feedbacksFilter.feedbackType ?? undefined,
          maxRating: feedbacksFilter.maxRating ?? undefined,
          cursor,
          first,
        },
        fetchPolicy: "network-only",
      });
      return result.data.adminTemplateFeedbacks ?? EMPTY_CONNECTION;
    },
    [apollo, variant, feedbacksFilter],
  );

  const {
    items: feedbacks,
    totalCount: feedbackTotalCount,
    hasNextPage: feedbacksHasNextPage,
    loading: feedbacksLoadingMore,
    error: feedbacksError,
    loadMore: loadMoreFeedbacks,
  } = useCursorPagination({
    initial: currentFeedbacks,
    fetchMore: fetchMoreFeedbacks,
    pageSize: PAGE_SIZE,
    resetKey: `${variant}:JUDGE:${feedbacksFilterKey}`,
  });

  const handleLoadMoreFeedbacks = useCallback(() => {
    void loadMoreFeedbacks();
  }, [loadMoreFeedbacks]);

  return (
    <JudgeTemplateView
      rows={initialBreakdownRows}
      breakdownLoading={false}
      breakdownError={null}
      template={initialJudgeTemplate}
      templateLoading={false}
      templateError={null}
      feedbacks={feedbacks}
      feedbackTotalCount={feedbackTotalCount}
      feedbacksHasNextPage={feedbacksHasNextPage}
      feedbacksLoadingMore={feedbacksLoadingMore}
      // フィルタ refetch のエラーと「もっと見る」のエラーは UI 上同じ
      // inline 表示でハンドルする (どちらもネットワーク経由のフェッチ失敗)。
      feedbacksError={feedbacksRefetchError ?? feedbacksError}
      onLoadMoreFeedbacks={handleLoadMoreFeedbacks}
      feedbackStats={initialStats}
      feedbacksFilter={feedbacksFilter}
      onFeedbacksFilterChange={setFeedbacksFilter}
      feedbacksFilterRefetching={refetchingFeedbacks}
    />
  );
}
