"use client";

import { useCallback, useState } from "react";
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
import { JudgeTemplateView } from "./JudgeTemplateView";

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

const EMPTY_CONNECTION: FeedbacksConnection = {
  __typename: "ReportFeedbacksConnection",
  edges: [],
  pageInfo: {
    __typename: "PageInfo",
    hasNextPage: false,
    endCursor: null,
  },
  totalCount: 0,
};

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
  const [feedbackTotalCount, setFeedbackTotalCount] = useState(
    initialFeedbacks?.totalCount ?? 0,
  );

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
          cursor,
          first,
        },
        fetchPolicy: "network-only",
      });
      const conn = result.data.adminTemplateFeedbacks ?? EMPTY_CONNECTION;
      setFeedbackTotalCount(conn.totalCount);
      return conn;
    },
    [apollo, variant],
  );

  const {
    items: feedbacks,
    hasNextPage: feedbacksHasNextPage,
    loading: feedbacksLoadingMore,
    loadMore: loadMoreFeedbacks,
  } = useCursorPagination({
    initial: initialFeedbacks ?? EMPTY_CONNECTION,
    fetchMore: fetchMoreFeedbacks,
    pageSize: PAGE_SIZE,
    resetKey: `${variant}:JUDGE`,
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
      onLoadMoreFeedbacks={handleLoadMoreFeedbacks}
      feedbackStats={initialStats}
    />
  );
}
