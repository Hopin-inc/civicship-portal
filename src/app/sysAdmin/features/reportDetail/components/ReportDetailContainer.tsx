"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import {
  useApproveReportMutation,
  usePublishReportMutation,
  useRejectReportMutation,
  useSubmitReportFeedbackMutation,
  type GqlGetAdminReportFeedbacksQuery,
  type GqlGetAdminReportFeedbacksQueryVariables,
  type GqlGetAdminReportQuery,
} from "@/types/graphql";
import { GET_ADMIN_REPORT_FEEDBACKS } from "@/graphql/account/report/query";
import { useCursorPagination } from "@/app/sysAdmin/_shared/hooks/useCursorPagination";
import { createEmptyConnection } from "@/app/sysAdmin/_shared/pagination/emptyConnection";
import { ReportDetailView } from "./ReportDetailView";
import type { FeedbackFormInput } from "./ReportFeedbackForm";

type Report = NonNullable<GqlGetAdminReportQuery["report"]>;
type FeedbacksConnection = NonNullable<
  NonNullable<GqlGetAdminReportFeedbacksQuery["report"]>["feedbacks"]
>;

type Props = {
  report: Report;
  body: string | null;
  initialFeedbacksConnection: FeedbacksConnection | null;
};

const PAGE_SIZE = 20;

const EMPTY_CONNECTION = createEmptyConnection(
  "ReportFeedbacksConnection",
) as FeedbacksConnection;

/**
 * `ReportDetailView` (presentational) と submitReportFeedback mutation を
 * 結ぶ container。
 *
 * フィードバック一覧は SSR 1 ページ目を `initialFeedbacksConnection` として
 * 受け取り、`useCursorPagination` で「もっと見る」を担当する
 * (テンプレート詳細の `GenerationTemplateContainer` と同じパターン)。
 *
 * 投稿成功後は `router.refresh()` で SSR を再走させ、`myFeedback` と
 * `feedbacks` connection を最新化する。Apollo cache を直接書き換える形に
 * すると、SSR で hydrate された initial state との整合を取るのが面倒
 * (Connection の cursor / totalCount との辻褄合わせ) なので、SSR 再走で
 * 揃えるのが運用上シンプル。
 */
export function ReportDetailContainer({
  report,
  body,
  initialFeedbacksConnection,
}: Props) {
  const router = useRouter();
  const apollo = useApolloClient();

  const [submit, { loading: saving, error: saveError }] =
    useSubmitReportFeedbackMutation();
  const [approve, { loading: approving, error: approveError }] =
    useApproveReportMutation();
  const [publish, { loading: publishing, error: publishError }] =
    usePublishReportMutation();
  const [reject, { loading: rejecting, error: rejectError }] =
    useRejectReportMutation();

  const handleSubmit = useCallback(
    async (input: FeedbackFormInput) => {
      try {
        await submit({
          variables: {
            input: {
              reportId: report.id,
              rating: input.rating,
              feedbackType: input.feedbackType ?? undefined,
              comment: input.comment ?? undefined,
            },
            permission: { communityId: report.community.id },
          },
        });
        router.refresh();
      } catch {
        // saveError state でハンドル済み
      }
    },
    [submit, report.id, report.community.id, router],
  );

  const handleSubmitSync = useCallback(
    (input: FeedbackFormInput) => {
      // form の onSubmit が同期 () => void なので、async 結果は捨てる
      void handleSubmit(input);
    },
    [handleSubmit],
  );

  // ステータス遷移系: success 後は router.refresh() で SSR 再走させ、
  // 表示の status / publishedAt / finalContent を最新化する。エラーは
  // approveError / publishError / rejectError state に残る。
  const handleApprove = useCallback(() => {
    void (async () => {
      try {
        await approve({ variables: { id: report.id } });
        router.refresh();
      } catch {
        // approveError state でハンドル済み
      }
    })();
  }, [approve, report.id, router]);

  const handlePublish = useCallback(
    (finalContent: string) => {
      void (async () => {
        try {
          await publish({ variables: { id: report.id, finalContent } });
          router.refresh();
        } catch {
          // publishError state でハンドル済み
        }
      })();
    },
    [publish, report.id, router],
  );

  const handleReject = useCallback(() => {
    void (async () => {
      try {
        await reject({ variables: { id: report.id } });
        router.refresh();
      } catch {
        // rejectError state でハンドル済み
      }
    })();
  }, [reject, report.id, router]);

  const fetchMoreFeedbacks = useCallback(
    async (cursor: string, first: number) => {
      const result = await apollo.query<
        GqlGetAdminReportFeedbacksQuery,
        GqlGetAdminReportFeedbacksQueryVariables
      >({
        query: GET_ADMIN_REPORT_FEEDBACKS,
        variables: { id: report.id, cursor, first },
        fetchPolicy: "network-only",
      });
      return result.data.report?.feedbacks ?? EMPTY_CONNECTION;
    },
    [apollo, report.id],
  );

  const {
    items: feedbacks,
    totalCount: feedbacksTotalCount,
    hasNextPage: feedbacksHasNextPage,
    loading: feedbacksLoadingMore,
    error: feedbacksError,
    loadMore: loadMoreFeedbacks,
  } = useCursorPagination({
    initial: initialFeedbacksConnection ?? EMPTY_CONNECTION,
    fetchMore: fetchMoreFeedbacks,
    pageSize: PAGE_SIZE,
    resetKey: report.id,
  });

  const handleLoadMoreFeedbacks = useCallback(() => {
    void loadMoreFeedbacks();
  }, [loadMoreFeedbacks]);

  return (
    <ReportDetailView
      report={report}
      body={body}
      feedbacks={feedbacks}
      feedbacksTotalCount={feedbacksTotalCount}
      feedbacksHasNextPage={feedbacksHasNextPage}
      feedbacksLoadingMore={feedbacksLoadingMore}
      feedbacksError={feedbacksError}
      onLoadMoreFeedbacks={handleLoadMoreFeedbacks}
      saving={saving}
      saveError={saveError ?? null}
      onSubmitFeedback={handleSubmitSync}
      approving={approving}
      publishing={publishing}
      rejecting={rejecting}
      approveError={approveError ?? null}
      publishError={publishError ?? null}
      rejectError={rejectError ?? null}
      onApprove={handleApprove}
      onPublish={handlePublish}
      onReject={handleReject}
    />
  );
}
