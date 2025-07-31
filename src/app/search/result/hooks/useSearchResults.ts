"use client";

import { useEffect, useMemo } from "react";
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
import { ActivityCard, QuestCard } from "@/app/activities/data/type";
import { presenterActivityCards } from "@/app/activities/data/presenter";
import { presenterQuestCards } from "@/app/activities/data/presenter";
import { IPrefectureCodeMap } from "@/app/search/data/type";
import { logger } from "@/lib/logging";

type CardType = ActivityCard | QuestCard;

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
} => {
  const filter = useMemo(() => buildFilter(searchParams), [searchParams]);

  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useGetOpportunitiesQuery({
    variables: {
      filter,
      first: 100,
      includeSlot: true,
      slotFilter: { hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled] },
      slotSort: { startsAt: GqlSortDirection.Asc },
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
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
  };
};

function buildFilter(searchParams: SearchParams): OpportunityFilterInput {
  const filter: OpportunityFilterInput = {
    publishStatus: [PublishStatus.Public],
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

  if (searchParams.from || searchParams.to) {
    const slotDateRange: Record<string, Date> = {};

    if (searchParams.from) {
      const [year, month, day] = searchParams.from.split("-").map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        slotDateRange.gte = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      }
    }

    if (searchParams.to) {
      const [year, month, day] = searchParams.to.split("-").map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        slotDateRange.lte = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
      }
    }

    if (Object.keys(slotDateRange).length > 0) {
      filter.slotDateRange = slotDateRange;
    }
  }

  if (searchParams.guests) {
    const guests = parseInt(searchParams.guests, 10);
    if (!isNaN(guests) && guests > 0) {
      filter.slotRemainingCapacity = guests;
    }
  }

  if (searchParams.ticket === "1") {
    filter.isReservableWithTicket = true;
  }

  if (searchParams.points === "1") {
    filter.isReservableWithPoint = true;
  }

  if (searchParams.q) {
    filter.keyword = searchParams.q;
  }

  return filter;
}

export default useSearchResults;
