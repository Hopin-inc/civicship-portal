"use client";

import { useOpportunities } from "@/app/admin/opportunities/hooks/useOpportunities";
import { OpportunityItem } from "@/app/admin/opportunities/components/OpportunityItem";
import { GqlPublishStatus } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { useRef } from "react";

interface OpportunityListProps {
  /**
   * フィルタする公開ステータス
   * "all" を指定すると全てのステータスを取得
   */
  status?: GqlPublishStatus | "all";
}

export function OpportunityList({ status = "all" }: OpportunityListProps) {
  const { data, loading, error, loadMoreRef, hasNextPage, isLoadingMore, refetch } =
    useOpportunities({ publishStatus: status });

  const refetchRef = useRef<(() => void) | null>(null);
  refetchRef.current = refetch;

  // 初期ロード中
  if (loading && !data) {
    return <LoadingIndicator fullScreen={false} />;
  }

  // エラー状態
  if (error) {
    return <ErrorState title="募集の読み込みに失敗しました" refetchRef={refetchRef} />;
  }

  // データが空
  if (!data || data.list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">
          {status === "all"
            ? "募集がありません"
            : status === GqlPublishStatus.Private
            ? "下書きの募集がありません"
            : "公開中の募集がありません"}
        </p>
      </div>
    );
  }

  // データ表示
  return (
    <div className="flex flex-col">
      {data.list.map((opportunity, idx) => (
        <div key={opportunity.id}>
          {idx !== 0 && <hr className="border-muted" />}
          <OpportunityItem opportunity={opportunity} />
        </div>
      ))}

      {/* 無限スクロールトリガー */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isLoadingMore && <LoadingIndicator fullScreen={false} />}
        </div>
      )}
    </div>
  );
}
