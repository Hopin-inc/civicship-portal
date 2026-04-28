"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { createEmptyConnection } from "@/app/sysAdmin/_shared/pagination/emptyConnection";
import { stableFilterKey } from "@/app/sysAdmin/_shared/pagination/filterKey";
import { GenerationTemplateView } from "./GenerationTemplateView";
import {
  EMPTY_FEEDBACKS_FILTER,
  type TemplateFeedbacksFilterValue,
} from "./TemplateFeedbacksFilter";
import type { PromptFormValues } from "./PromptEditor";

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

const EMPTY_CONNECTION = createEmptyConnection(
  "ReportFeedbacksConnection",
) as FeedbacksConnection;

/**
 * `GenerationTemplateView` (presentational) と
 * mutation hook + feedback pagination を結ぶ container。
 *
 * 初期 data (breakdown / template / feedbacks 1 ページ目) は SSR で取得して
 * props で受け取る。client-side fetch は auth race の原因になるため使わない。
 * 「もっと見る」だけ Apollo client.query で追加ページを取りに行く。
 *
 * Prompt の編集 state は `<PromptEditor>` 内の react-hook-form が管理する
 * (= Container は initial 値を渡し submit 時の values を受け取るだけ)。
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

  const [save, { loading: saving, error: saveError }] =
    useUpdateReportTemplateMutation();

  const handleSubmitPrompt = useCallback(
    async (values: PromptFormValues) => {
      if (!initialTemplate) return;
      try {
        await save({
          variables: {
            variant,
            input: {
              model: initialTemplate.model,
              maxTokens: initialTemplate.maxTokens,
              temperature: initialTemplate.temperature ?? undefined,
              stopSequences: initialTemplate.stopSequences,
              systemPrompt: values.systemPrompt,
              userPromptTemplate: values.userPromptTemplate,
              experimentKey: initialTemplate.experimentKey ?? undefined,
              isActive: initialTemplate.isActive,
              isEnabled: initialTemplate.isEnabled,
              trafficWeight: initialTemplate.trafficWeight,
              communityContext: initialTemplate.communityContext ?? undefined,
            },
          },
        });
        // SSR 経路の data を最新化する → PromptEditor の useEffect で
        // initial が新値に reset される
        router.refresh();
      } catch {
        // saveError state でハンドル済み
      }
    },
    [initialTemplate, save, variant, router],
  );

  const handleSubmitPromptSync = useCallback(
    (values: PromptFormValues) => {
      void handleSubmitPrompt(values);
    },
    [handleSubmitPrompt],
  );

  const [feedbacksFilter, setFeedbacksFilter] =
    useState<TemplateFeedbacksFilterValue>(EMPTY_FEEDBACKS_FILTER);
  const feedbacksFilterKey = useMemo(
    () => stableFilterKey({ ...feedbacksFilter }),
    [feedbacksFilter],
  );

  // SSR で取った 1 ページ目はフィルタ無し。フィルタ設定時のみ client refetch
  // して initial を差し替え、resetKey 連動で `useCursorPagination` を初期化。
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
            kind: GqlReportTemplateKind.Generation,
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
          kind: GqlReportTemplateKind.Generation,
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
    // resetKey は使わない: filter 変更時の resetKey 切替が currentFeedbacks
    // の async 更新より先に走るため、hook が古い currentFeedbacks を使って
    // 一度 reset し、新 connection が届いても useEffect が再 fire しない
    // (= stale data) 問題を避ける。state 参照の変化に reset を任せる。
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
      saving={saving}
      saveError={saveError ?? null}
      onSubmitPrompt={handleSubmitPromptSync}
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
