"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import {
  GqlReportTemplateKind,
  useUpdateReportTemplateMutation,
  type GqlGetAdminTemplateFeedbackStatsQuery,
  type GqlGetAdminTemplateFeedbacksQuery,
  type GqlGetAdminTemplateFeedbacksQueryVariables,
  type GqlReportTemplateFieldsFragment,
  type GqlReportTemplateStatsBreakdownRowFieldsFragment,
  type GqlReportVariant,
} from "@/types/graphql";
import { GET_ADMIN_TEMPLATE_FEEDBACKS } from "@/graphql/account/adminTemplateFeedbacks/query";
import { useCursorPagination } from "@/app/sysAdmin/_shared/hooks/useCursorPagination";
import { GenerationTemplateView } from "./GenerationTemplateView";

type FeedbacksConnection = NonNullable<
  GqlGetAdminTemplateFeedbacksQuery["adminTemplateFeedbacks"]
>;
type FeedbackStats =
  GqlGetAdminTemplateFeedbackStatsQuery["adminTemplateFeedbackStats"];

type Props = {
  variant: GqlReportVariant;
  initialBreakdownRows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  initialTemplate: GqlReportTemplateFieldsFragment | null;
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
 * `GenerationTemplateView` (presentational) と
 * mutation hook + feedback pagination を結ぶ container。
 *
 * 初期 data (breakdown / template / feedbacks 1 ページ目) は SSR で取得して
 * props で受け取る。client-side fetch は auth race の原因になるため使わない。
 * 「もっと見る」だけ Apollo client.query で追加ページを取りに行く。
 *
 * 保存後は `router.refresh()` で SSR を再走させ、stats / template / feedbacks
 * を最新化する。
 */
export function GenerationTemplateContainer({
  variant,
  initialBreakdownRows,
  initialTemplate,
  initialFeedbacks,
  initialStats,
}: Props) {
  const router = useRouter();
  const apollo = useApolloClient();
  const [systemPrompt, setSystemPrompt] = useState(
    initialTemplate?.systemPrompt ?? "",
  );
  const [userPromptTemplate, setUserPromptTemplate] = useState(
    initialTemplate?.userPromptTemplate ?? "",
  );
  const [feedbackTotalCount, setFeedbackTotalCount] = useState(
    initialFeedbacks?.totalCount ?? 0,
  );

  const [save, { loading: saving, error: saveError }] =
    useUpdateReportTemplateMutation();

  const handleSave = useCallback(async () => {
    if (!initialTemplate) return;
    // ボタン onClick から呼ばれて promise が捨てられるため、ここで例外を握る。
    // mutation のエラーは Apollo の `saveError` 経由で UI に伝わる。
    try {
      await save({
        variables: {
          variant,
          input: {
            model: initialTemplate.model,
            maxTokens: initialTemplate.maxTokens,
            temperature: initialTemplate.temperature ?? undefined,
            stopSequences: initialTemplate.stopSequences,
            systemPrompt,
            userPromptTemplate,
            experimentKey: initialTemplate.experimentKey ?? undefined,
            isActive: initialTemplate.isActive,
            isEnabled: initialTemplate.isEnabled,
            trafficWeight: initialTemplate.trafficWeight,
            communityContext: initialTemplate.communityContext ?? undefined,
          },
        },
      });
      // SSR 経路の data を最新化する
      router.refresh();
    } catch {
      // saveError state でハンドル済み
    }
  }, [initialTemplate, save, variant, systemPrompt, userPromptTemplate, router]);

  const isDirty =
    initialTemplate != null &&
    (systemPrompt !== initialTemplate.systemPrompt ||
      userPromptTemplate !== initialTemplate.userPromptTemplate);

  const fetchMoreFeedbacks = useCallback(
    async (cursor: string, first: number) => {
      const result = await apollo.query<
        GqlGetAdminTemplateFeedbacksQuery,
        GqlGetAdminTemplateFeedbacksQueryVariables
      >({
        query: GET_ADMIN_TEMPLATE_FEEDBACKS,
        variables: {
          variant,
          kind: GqlReportTemplateKind.Generation,
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
    resetKey: `${variant}:GENERATION`,
  });

  const handleLoadMoreFeedbacks = useCallback(() => {
    void loadMoreFeedbacks();
  }, [loadMoreFeedbacks]);

  return (
    <GenerationTemplateView
      rows={initialBreakdownRows}
      breakdownLoading={false}
      breakdownError={null}
      template={initialTemplate}
      editorLoading={false}
      editorError={null}
      systemPrompt={systemPrompt}
      userPromptTemplate={userPromptTemplate}
      isDirty={isDirty}
      saving={saving}
      saveError={saveError ?? null}
      setSystemPrompt={setSystemPrompt}
      setUserPromptTemplate={setUserPromptTemplate}
      onSave={handleSave}
      feedbacks={feedbacks}
      feedbackTotalCount={feedbackTotalCount}
      feedbacksHasNextPage={feedbacksHasNextPage}
      feedbacksLoadingMore={feedbacksLoadingMore}
      onLoadMoreFeedbacks={handleLoadMoreFeedbacks}
      feedbackStats={initialStats}
    />
  );
}
