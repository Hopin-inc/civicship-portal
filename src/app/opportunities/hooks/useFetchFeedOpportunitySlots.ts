import {
  GqlOpportunityCategory,
  GqlOpportunitySlotHostingStatus,
  GqlPublishStatus,
  GqlSortDirection,
  useGetFeedOpportunitySlotsQuery,
} from "@/types/graphql";
import { useFeatureCheck } from "@/hooks/useFeatureCheck";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";
import { useMemo } from "react";

type FeedSlotNode = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useGetFeedOpportunitySlotsQuery>["data"]>["opportunitySlots"]["edges"]
  >[number]
>["node"];

const mapSlotToActivityCard = (slot: NonNullable<FeedSlotNode>): ActivityCard | null => {
  const opportunity = slot.opportunity;
  if (!opportunity || opportunity.category !== GqlOpportunityCategory.Activity) return null;

  return {
    id: opportunity.id,
    title: opportunity.title,
    category: opportunity.category,
    feeRequired: opportunity.feeRequired ?? null,
    location: opportunity.place?.name || "場所未定",
    images: opportunity.images || [],
    communityId: opportunity.community?.id || COMMUNITY_ID,
    hasReservableTicket: opportunity.isReservableWithTicket || false,
    pointsRequired: opportunity.pointsRequired ?? null,
    slots: [{
      id: slot.id,
      hostingStatus: slot.hostingStatus,
      startsAt: slot.startsAt,
      endsAt: slot.endsAt,
    }],
  };
};

const mapSlotToQuestCard = (slot: NonNullable<FeedSlotNode>): QuestCard | null => {
  const opportunity = slot.opportunity;
  if (!opportunity || opportunity.category !== GqlOpportunityCategory.Quest) return null;

  return {
    id: opportunity.id,
    title: opportunity.title,
    category: opportunity.category,
    pointsToEarn: opportunity.pointsToEarn ?? null,
    location: opportunity.place?.name || "場所未定",
    images: opportunity.images || [],
    communityId: opportunity.community?.id || COMMUNITY_ID,
    hasReservableTicket: opportunity.isReservableWithTicket || false,
    pointsRequired: opportunity.pointsRequired ?? null,
    slots: [{
      id: slot.id,
      hostingStatus: slot.hostingStatus,
      startsAt: slot.startsAt,
      endsAt: slot.endsAt,
    }],
  };
};

export function useFetchFeedOpportunitySlots() {
  const shouldShowQuests = useFeatureCheck("quests");

  const categories = [
    GqlOpportunityCategory.Activity,
    ...(shouldShowQuests ? [GqlOpportunityCategory.Quest] : []),
  ];

  const { data, loading, fetchMore, refetch, error } = useGetFeedOpportunitySlotsQuery({
    variables: {
      filter: {
        communityIds: [COMMUNITY_ID],
        category: categories.length === 1 ? categories[0] : undefined,
        publishStatus: [GqlPublishStatus.Public],
        hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled],
      },
      sort: {
        startsAt: GqlSortDirection.Asc,
      },
      first: 30,
    },
    fetchPolicy: "cache-first",
  });

  const opportunitySlots = data?.opportunitySlots;
  const endCursor = opportunitySlots?.pageInfo?.endCursor;
  const hasNextPage = opportunitySlots?.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage) return;

    await fetchMore({
      variables: {
        filter: {
          communityIds: [COMMUNITY_ID],
          category: categories.length === 1 ? categories[0] : undefined,
          publishStatus: [GqlPublishStatus.Public],
          hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled],
        },
        sort: {
          startsAt: GqlSortDirection.Asc,
        },
        cursor: endCursor,
        first: 20,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.opportunitySlots || !prev.opportunitySlots) {
          return prev;
        }

        return {
          ...prev,
          opportunitySlots: {
            ...prev.opportunitySlots,
            edges: [
              ...(prev.opportunitySlots.edges ?? []),
              ...(fetchMoreResult.opportunitySlots.edges ?? []),
            ],
            pageInfo: fetchMoreResult.opportunitySlots.pageInfo,
          },
        };
      },
    });
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading,
    onLoadMore: handleFetchMore,
  });

  const opportunityCards = useMemo(() => {
    const edges = data?.opportunitySlots?.edges ?? [];
    const cardMap = new Map<string, ActivityCard | QuestCard>();

    for (const edge of edges) {
      const slot = edge?.node;
      if (!slot?.opportunity) continue;

      const opportunityId = slot.opportunity.id;
      const existingCard = cardMap.get(opportunityId);

      if (existingCard) {
        existingCard.slots.push({
          id: slot.id,
          hostingStatus: slot.hostingStatus,
          startsAt: slot.startsAt,
          endsAt: slot.endsAt,
        });
      } else {
        const card =
          slot.opportunity.category === GqlOpportunityCategory.Activity
            ? mapSlotToActivityCard(slot)
            : mapSlotToQuestCard(slot);

        if (card) {
          cardMap.set(opportunityId, card);
        }
      }
    }

    return Array.from(cardMap.values());
  }, [data]);

  const { featuredCards, upcomingCards } = useMemo(() => {
    const hasImages = (card: ActivityCard | QuestCard) => card.images && card.images.length > 0;
    const validCards = opportunityCards.filter(hasImages);

    const featuredCards = validCards.slice(0, 3);
    const upcomingCards = validCards.slice(3);

    return { featuredCards, upcomingCards };
  }, [opportunityCards]);

  return {
    featuredCards,
    upcomingCards,
    loading,
    loadMoreRef,
    refetch,
    error,
  };
}
