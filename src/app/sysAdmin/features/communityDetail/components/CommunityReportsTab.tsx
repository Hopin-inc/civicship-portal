"use client";

import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const goToDetail = (id: string) => {
    router.push(`/sysAdmin/${communityId}/reports/${id}`);
  };
  if (loading && reports.length === 0) {
    return <LoadingIndicator fullScreen={false} />;
  }

  // 初回ロード失敗のみ全画面 ErrorState。
  // pagination 失敗 (= 既にデータがある) は table を残して下部にインライン表示する
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
      <div className="overflow-hidden rounded border border-border">
        <Table className="text-body-sm">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="h-9 px-2 py-1.5">公開日</TableHead>
              <TableHead className="h-9 px-2 py-1.5">種類</TableHead>
              <TableHead className="h-9 px-2 py-1.5">ステータス</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow
                key={r.id}
                tabIndex={0}
                role="link"
                onClick={() => goToDetail(r.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToDetail(r.id);
                  }
                }}
                className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none"
              >
                <TableCell className="px-2 py-1.5 tabular-nums">
                  {r.publishedAt
                    ? new Date(r.publishedAt).toLocaleDateString("ja-JP")
                    : "—"}
                </TableCell>
                <TableCell className="px-2 py-1.5">
                  {variantLabel(r.variant)}
                </TableCell>
                <TableCell className="px-2 py-1.5 text-muted-foreground">
                  {statusLabel(r.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
