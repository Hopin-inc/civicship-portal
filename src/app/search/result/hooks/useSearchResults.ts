"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GqlCurrentPrefecture,
  GqlOpportunitiesConnection,
  GqlOpportunityCategory as OpportunityCategory,
  GqlOpportunityFilterInput as OpportunityFilterInput,
  GqlOpportunitySlotHostingStatus,
  GqlPublishStatus as PublishStatus,
  GqlSortDirection,
  useGetOpportunitiesQuery,
} from "@/types/graphql";
import { groupCardsByDate, SearchParams } from "@/app/search/data/presenter";
import { toast } from "sonner";
import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";
import {
  presenterActivityCards,
  presenterQuestCards,
} from "@/components/domains/opportunities/data/presenter";
import { IPrefectureCodeMap } from "@/app/search/data/type";
import { logger } from "@/lib/logging";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

type CardType = ActivityCard | QuestCard;
const DEFAULT_PAGE_SIZE = 15;

function getTodayStartInJST(): Date {
  const parts = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")!.value;
  const month = parts.find((part) => part.type === "month")!.value;
  const day = parts.find((part) => part.type === "day")!.value;

  const jstDateString = `${year}-${month}-${day}`;

  return new Date(`${jstDateString}T00:00:00+09:00`);
}

function parseDateStringToUTC(dateString: string, isEndOfDay: boolean = false): Date | null {
  const [year, month, day] = dateString.split("-").map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null;
  }

  if (isEndOfDay) {
    return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  }
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

function buildSlotDateRange(searchParams: SearchParams): Record<string, Date> {
  const slotDateRange: Record<string, Date> = {};
  
  const fromDate = searchParams.from ? parseDateStringToUTC(searchParams.from) : null;

  if (fromDate) {
    slotDateRange.gte = fromDate;
  } else {
    slotDateRange.gte = getTodayStartInJST();
  }
  
  if (searchParams.to) {
    const toDate = parseDateStringToUTC(searchParams.to, true);
    if (toDate) {
      slotDateRange.lte = toDate;
    }
  }
  
  return slotDateRange;
}

export const useSearchResults = (
  searchParams: SearchParams = {},
): {
  opportunities: GqlOpportunitiesConnection;
  recommendedOpportunities: CardType[];
  groupedOpportunities: { [key: string]: CardType[] };
  loading: boolean;
  error: Error | null;
  hasResults: boolean;
  refetch: () => void;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  hasNextPage: boolean;
  isLoadingMore: boolean;
} => {
  const filter = useMemo(() => buildFilter(searchParams), [searchParams]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 共通のクエリ変数を定義
  const baseQueryVariables = useMemo(() => ({
    filter,
    first: DEFAULT_PAGE_SIZE,
    includeSlot: true,
    slotFilter: { hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled] },
    slotSort: { startsAt: GqlSortDirection.Asc },
  }), [filter]);

  const {
     data,
     loading: queryLoading,
     error,
     fetchMore,
     refetch,
    } = useGetOpportunitiesQuery({
    variables: baseQueryVariables,
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const opportunities = useMemo(
    () =>
      data?.opportunities || {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
        totalCount: 0,
      },
    [data],
  );

  const endCursor = opportunities.pageInfo?.endCursor;
  const hasNextPage = opportunities.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = useCallback(async () => {
    if (!hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          ...baseQueryVariables,
          cursor: endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !prev.opportunities || !fetchMoreResult.opportunities) {
            return prev;
          }

          // パフォーマンス最適化: 重複排除を効率的に実行
          const existingIds = new Set(prev.opportunities.edges.map(edge => edge?.node?.id));
          const newUniqueEdges = [];
          for (const edge of fetchMoreResult.opportunities.edges) {
            const id = edge?.node?.id;
            if (id && !existingIds.has(id)) {
              newUniqueEdges.push(edge);
              existingIds.add(id); // 新しく追加したIDも重複チェックの対象にする
            }
          }

          return {
            ...prev,
            opportunities: {
              ...prev.opportunities,
              edges: [...prev.opportunities.edges, ...newUniqueEdges],
              pageInfo: fetchMoreResult.opportunities.pageInfo,
            },
          };
        },
      });
    } catch (error) {
      logger.error("Error fetching more search results", { error, searchParams });
      toast.error("追加データの取得に失敗しました");
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasNextPage, isLoadingMore, baseQueryVariables, endCursor, fetchMore, searchParams]);

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage && !queryLoading, // 初回ローディング中は無効化
    isLoading: isLoadingMore,
    onLoadMore: handleFetchMore,
  });

  const recommendedOpportunities = useMemo(() => {
    if (searchParams.type === "quest") {
      return presenterQuestCards(opportunities.edges);
    }
    return presenterActivityCards(opportunities.edges);
  }, [opportunities, searchParams.type]);
  
  const groupedOpportunities = useMemo(
    () =>
      groupCardsByDate(
        recommendedOpportunities,
        {
          gte: filter.slotDateRange?.gte,
          lte: filter.slotDateRange?.lte,
        }
      ),
    [recommendedOpportunities, filter.slotDateRange],
  );

  const hasResults = recommendedOpportunities.length > 0;

  useEffect(() => {
    if (error) {
      logger.info("Error fetching search results", {
        error: error.message || String(error),
        component: "useSearchResults",
      });
      toast.error("検索結果の取得に失敗しました");
    }
  }, [error]);

  return {
    opportunities,
    recommendedOpportunities,
    groupedOpportunities,
    loading: queryLoading,
    error: error ?? null,
    hasResults,
    refetch,
    loadMoreRef,
    hasNextPage,
    isLoadingMore,
  };
};

function buildFilter(searchParams: SearchParams): OpportunityFilterInput {
  const filter: OpportunityFilterInput = {
    publishStatus: [PublishStatus.Public],
    communityIds: [COMMUNITY_ID],
  };

  if (searchParams.type === "activity") {
    filter.category = OpportunityCategory.Activity;
  } else if (searchParams.type === "quest") {
    filter.category = OpportunityCategory.Quest;
  }

  const location = searchParams.location as GqlCurrentPrefecture;
  if (location && IPrefectureCodeMap[location]) {
    filter.stateCodes = [IPrefectureCodeMap[location]];
  }

  filter.slotDateRange = buildSlotDateRange(searchParams);

  if (searchParams.guests) {
    const guests = Number(searchParams.guests);
    if (Number.isInteger(guests) && guests > 0) {
      filter.slotRemainingCapacity = guests;
    }
  }

  if (searchParams.ticket === "1") {
    filter.isReservableWithTicket = true;
  }

  if (searchParams.points === "1") {
    filter.isReservableWithPoint = true;
  }

  const keyword = searchParams.q?.trim();
  if (keyword) filter.keyword = keyword;

  return filter;
}

export default useSearchResults;
