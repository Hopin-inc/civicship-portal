"use client";

import { useEffect, useMemo } from "react";
import { useHeader } from "@/components/providers/HeaderProvider";
import { useLoading } from "@/hooks/useLoading";
import {
  GqlCurrentPrefecture,
  GqlOpportunitiesConnection,
  GqlOpportunityCategory as OpportunityCategory,
  GqlOpportunityFilterInput as OpportunityFilterInput,
  GqlPublishStatus as PublishStatus,
  useSearchOpportunitiesQuery,
} from "@/types/graphql";
import { groupOpportunitiesByDate, SearchParams } from "@/app/search/data/presenter";
import { toast } from "sonner";
import { ActivityCard } from "@/app/activities/data/type";
import { presenterActivityCards } from "@/app/activities/data/presenter";
import { IPrefectureCodeMap } from "@/app/search/data/type";

function buildFilter(searchParams: SearchParams): OpportunityFilterInput {
  console.log(searchParams);

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
  if (searchParams.from) {
    const fromDate = new Date(searchParams.from);
    fromDate.setUTCHours(0, 0, 0, 0);
    filter.slotStartsAt = fromDate;
  }

  if (searchParams.to) {
    const toDate = new Date(searchParams.to);
    toDate.setUTCHours(23, 59, 59, 999);
    filter.slotEndsAt = toDate;
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
} => {
  const { updateConfig } = useHeader();
  const { setIsLoading } = useLoading();

  const filter = useMemo(() => buildFilter(searchParams), [searchParams]);

  const {
    data,
    loading: queryLoading,
    error,
  } = useSearchOpportunitiesQuery({
    variables: { filter, first: 20 },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    setIsLoading(queryLoading && !data);
  }, [queryLoading, data, setIsLoading]);

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
    () => groupOpportunitiesByDate(opportunities),
    [opportunities],
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
  };
};

export default useSearchResults;
