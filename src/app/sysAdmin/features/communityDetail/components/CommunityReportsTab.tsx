"use client";

import { useMemo } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
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
 */
export function CommunityReportsTab({ communityId }: Props) {
  const { data, loading, error } = useGetAdminBrowseReportsQuery({
    variables: { communityId, first: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
  });

  const reports = useMemo(
    () =>
      data?.adminBrowseReports.edges
        ?.map((e) => e?.node)
        .filter(<T,>(n: T | null | undefined): n is T => n != null) ?? [],
    [data],
  );

  const totalCount = data?.adminBrowseReports.totalCount ?? 0;

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
        <span className="tabular-nums">{totalCount} 件</span>
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
      {data?.adminBrowseReports.pageInfo.hasNextPage && (
        <p className="text-body-xs text-muted-foreground text-center">
          {totalCount} 件中 {reports.length} 件を表示中 (古い履歴は省略)
        </p>
      )}
    </div>
  );
}
