"use client";

import { useInfiniteScrollQuery } from "@/hooks/useInfiniteScrollQuery";
import { GET_ADMIN_OPPORTUNITIES } from "@/graphql/experience/opportunity/query";
import {
  GqlPublishStatus,
  GqlOpportunitiesConnection,
  GqlGetAdminOpportunitiesQuery,
} from "@/types/graphql";
import { presentOpportunityList } from "../presenters/presentOpportunityList";
import { useMemo } from "react";

interface UseOpportunitiesOptions {
  /**
   * フィルタする公開ステータス
   * "all" を指定すると全てのステータスを取得
   */
  publishStatus?: GqlPublishStatus | "all";
}

interface UseOpportunitiesReturn {
  data: ReturnType<typeof presentOpportunityList> | null;
  loading: boolean;
  error: any;
  loadMoreRef: (node: HTMLDivElement | null) => void;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  refetch: () => void;
}

export function useOpportunities(options?: UseOpportunitiesOptions): UseOpportunitiesReturn {
  const { publishStatus = "all" } = options || {};

  // GraphQLフィルタの構築
  const filter = useMemo(() => {
    if (publishStatus === "all") return undefined;
    return { publishStatus };
  }, [publishStatus]);

  // useInfiniteScrollQueryを使用
  const { data, loading, error, loadMoreRef, hasNextPage, isLoadingMore, refetch } =
    useInfiniteScrollQuery<GqlGetAdminOpportunitiesQuery, GqlOpportunitiesConnection, any>(
      GET_ADMIN_OPPORTUNITIES,
      {
        connectionKey: "opportunities",
        variables: {
          filter,
          first: 20,
        },
        onError: () => "募集の取得に失敗しました",
      }
    );

  // プレゼンテーション層への変換
  const formatted = useMemo(() => {
    return data ? presentOpportunityList(data.opportunities) : null;
  }, [data]);

  return {
    data: formatted,
    loading,
    error,
    loadMoreRef,
    hasNextPage,
    isLoadingMore,
    refetch,
  };
}
