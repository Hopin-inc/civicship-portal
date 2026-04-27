"use client";

/**
 * L2 詳細の [レポート] タブ skeleton。
 *
 * Phase 2 で backend が adminBrowseReports query を実装した後、ここに:
 *   - 直近発行サマリ (lastPublishedAt / publishedCountLast90Days)
 *   - レポート発行履歴 (status / variant / publishedAt の table)
 *   - 個別 report への遷移
 * を実装する。
 *
 * 現時点では sysAdmin が「この community の運営活動度」を把握する placeholder。
 */

type Props = {
  communityId: string;
};

export function CommunityReportsTab({ communityId }: Props) {
  return (
    <div className="space-y-4 py-4">
      <p className="text-body-sm text-muted-foreground">
        準備中: この community のレポート発行履歴を表示します
      </p>
      <p className="text-body-xs text-muted-foreground">
        backend の adminBrowseReports query 実装後に有効化されます
        (community: {communityId})
      </p>
    </div>
  );
}
