"use client";

import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import {
  GqlReportStatus,
  type GqlReportVariant,
} from "@/types/graphql";
import { variantLabel, statusLabel } from "@/app/sysAdmin/features/system/templates/shared/labels";

export type ReportRow = {
  id: string;
  variant: GqlReportVariant;
  status: GqlReportStatus;
  publishedAt?: Date | null;
  feedbacksCount: number;
};

export type CommunityReportsTabProps = {
  /** 行クリックで Report detail page (`/sysAdmin/{communityId}/reports/{id}`) に遷移するため */
  communityId: string;
  reports: ReportRow[];
  totalCount: number;
  hasNextPage: boolean;
  loading: boolean;
  error: unknown;
  loadingMore: boolean;
  onLoadMore: () => void;
};

const REPORT_STATUS_COLORS: Record<GqlReportStatus, string> = {
  [GqlReportStatus.Published]: "bg-green-500",
  [GqlReportStatus.Approved]: "bg-blue-500",
  [GqlReportStatus.Draft]: "bg-gray-400",
  [GqlReportStatus.Rejected]: "bg-red-500",
  [GqlReportStatus.Skipped]: "bg-yellow-500",
  [GqlReportStatus.Superseded]: "bg-gray-300",
};

/**
 * L2 詳細の [レポート] タブ (presentational only)。
 * data fetching は `CommunityReportsTabContainer` 側で行う。
 */
export function CommunityReportsTab({
  communityId,
  reports,
  totalCount,
  hasNextPage,
  loading,
  error,
  loadingMore,
  onLoadMore,
}: CommunityReportsTabProps) {
  const router = useRouter();
  if (loading && reports.length === 0) {
    return <LoadingIndicator fullScreen={false} />;
  }

  // 初回ロード失敗のみ全画面 ErrorState。
  // pagination 失敗 (= 既にデータがある) は list を残して下部にインライン表示する
  // (load-more ボタンも残るのでリトライ可能)。
  if (error && reports.length === 0) {
    return <ErrorState title="レポート履歴の取得に失敗しました" />;
  }

  if (reports.length === 0) {
    return (
      <div className="py-8 text-center text-body-sm text-muted-foreground">
        この community のレポートはまだ発行されていません
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-baseline justify-between text-body-sm text-muted-foreground">
        <span>レポート発行履歴</span>
        <span className="tabular-nums">
          {reports.length} / {Math.max(totalCount, reports.length)} 件
        </span>
      </div>
      <ItemGroup className="overflow-hidden rounded border border-border divide-y divide-border">
        {reports.map((r) => (
          <Item
            key={r.id}
            asChild
            className="rounded-none border-transparent"
          >
            <a
              href={`/sysAdmin/${communityId}/reports/${r.id}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                router.push(`/sysAdmin/${communityId}/reports/${r.id}`);
              }}
              className="flex flex-1 gap-3"
            >
              <div className="flex flex-1 flex-col min-w-0">
                <ItemContent>
                  <ItemTitle className="font-bold text-base leading-snug line-clamp-2">
                    {variantLabel(r.variant)}
                  </ItemTitle>
                </ItemContent>
                <ItemFooter className="mt-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                    <span className="flex items-center gap-1">
                      <span
                        className={cn(
                          "size-2.5 rounded-full",
                          REPORT_STATUS_COLORS[r.status],
                        )}
                        aria-label={statusLabel(r.status)}
                      />
                      {statusLabel(r.status)}・
                      {r.publishedAt
                        ? new Date(r.publishedAt).toLocaleDateString("ja-JP")
                        : "未公開"}
                      <span className="mx-1">・</span>
                      <span className="tabular-nums">{r.feedbacksCount}件</span>
                    </span>
                  </div>
                </ItemFooter>
              </div>
            </a>
          </Item>
        ))}
      </ItemGroup>
      {error != null && (
        <p className="text-center text-body-sm text-destructive">
          追加読み込みに失敗しました
        </p>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="tertiary"
            size="sm"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "読み込み中..." : "もっと見る"}
          </Button>
        </div>
      )}
    </div>
  );
}
