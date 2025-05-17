"use client";

import { useEffect, useMemo } from "react";
import { useHeader } from "@/components/providers/HeaderProvider";
import {
  GqlCurrentPrefecture,
  GqlOpportunitiesConnection,
  GqlOpportunityCategory as OpportunityCategory,
  GqlOpportunityFilterInput as OpportunityFilterInput,
  GqlPublishStatus as PublishStatus,
  useGetOpportunitiesQuery,
} from "@/types/graphql";
import { groupOpportunitiesByDate, SearchParams } from "@/app/search/data/presenter";
import { toast } from "sonner";
import { ActivityCard } from "@/app/activities/data/type";
import { presenterActivityCards } from "@/app/activities/data/presenter";
import { IPrefectureCodeMap } from "@/app/search/data/type";

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
    filter.cityCodes = [IPrefectureCodeMap[location]];
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

  if (searchParams.ticket === "true") {
    filter.isReservableWithTicket = true;
  }

  if (searchParams.q) {
    filter.keyword = searchParams.q;
  }

  return filter;
}

export const useSearchResults = (
  searchParams: SearchParams = {},
): {
  opportunities: GqlOpportunitiesConnection;
  recommendedOpportunities: ActivityCard[];
  groupedOpportunities: { [key: string]: ActivityCard[] };
  loading: boolean;
  error: Error | null;
  hasResults: boolean;
  refetch: () => void;
} => {
  const { updateConfig } = useHeader();

  const filter = useMemo(() => buildFilter(searchParams), [searchParams]);

  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useGetOpportunitiesQuery({
    variables: { filter, first: 20 },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  useEffect(() => {
    updateConfig({
      showSearchForm: true,
      searchParams: {
        location: searchParams.location,
        from: searchParams.from,
        to: searchParams.to,
        guests: searchParams.guests ? parseInt(searchParams.guests) : undefined,
      },
      showLogo: false,
      showBackButton: true,
    });
  }, [searchParams, updateConfig]);

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

  const recommendedOpportunities = useMemo(
    () => presenterActivityCards(opportunities.edges),
    [opportunities],
  );

  const groupedOpportunities = useMemo(
    () =>
      groupOpportunitiesByDate(opportunities, {
        gte: filter.slotDateRange?.gte,
        lte: filter.slotDateRange?.lte,
      }),
    [opportunities, filter.slotDateRange],
  );

  const hasResults = recommendedOpportunities.length > 0;

  useEffect(() => {
    if (error) {
      console.error("Error fetching search results:", error);
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

export default useSearchResults;
