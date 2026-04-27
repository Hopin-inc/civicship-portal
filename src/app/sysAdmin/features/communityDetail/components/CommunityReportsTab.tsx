"use client";

import { useMemo, useState } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { useGetAdminBrowseReportsQuery } from "@/types/graphql";
import { variantLabel, statusLabel } from "@/app/sysAdmin/features/system/templates/shared/labels";

const PAGE_SIZE = 20;

type Props = {
  communityId: string;
};

/**
 * L2 詳細の [レポート] タブ。
 * adminBrowseReports query で community 単位のレポート発行履歴を取得し、
 * status / variant / publishedAt の table を表示。
 * cursor pagination は「もっと見る」ボタン経由で段階ロード。
 */
export function CommunityReportsTab({ communityId }: Props) {
  const { data, loading, error, fetchMore } = useGetAdminBrowseReportsQuery({
    variables: { communityId, first: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
  });
  const [loadingMore, setLoadingMore] = useState(false);

  const reports = useMemo(
    () =>
      data?.adminBrowseReports.edges
        ?.map((e) => e?.node)
        .filter(<T,>(n: T | null | undefined): n is T => n != null) ?? [],
    [data],
  );

  const totalCount = data?.adminBrowseReports.totalCount ?? 0;
  const hasNextPage = data?.adminBrowseReports.pageInfo.hasNextPage ?? false;
  const endCursor = data?.adminBrowseReports.pageInfo.endCursor ?? null;

  const handleLoadMore = async () => {
    if (!endCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchMore({
        variables: { cursor: endCursor, first: PAGE_SIZE },
        updateQuery: (prev, { fetchMoreResult }) => ({
          adminBrowseReports: {
            ...fetchMoreResult.adminBrowseReports,
            edges: [
              ...(prev.adminBrowseReports.edges ?? []),
              ...(fetchMoreResult.adminBrowseReports.edges ?? []),
            ],
          },
        }),
      });
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading && reports.length === 0) {
    return <LoadingIndicator fullScreen={false} />;
  }

  if (error) {
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
          {reports.length} / {totalCount} 件
        </span>
      </div>
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-body-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium">公開日</th>
              <th className="px-2 py-1.5 text-left font-medium">種類</th>
              <th className="px-2 py-1.5 text-left font-medium">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-2 py-1.5 tabular-nums">
                  {r.publishedAt
                    ? new Date(r.publishedAt).toLocaleDateString("ja-JP")
                    : "—"}
                </td>
                <td className="px-2 py-1.5">{variantLabel(r.variant)}</td>
                <td className="px-2 py-1.5 text-muted-foreground">
                  {statusLabel(r.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="tertiary"
            size="sm"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "読み込み中..." : "もっと見る"}
          </Button>
        </div>
      )}
    </div>
  );
}
