import { GqlOpportunityCategory } from "@/types/graphql";

export const selectBadge = (hasReservableTicket: boolean | null, pointsRequired: number | null) => {
  switch (true) {
    case hasReservableTicket && pointsRequired !== null && pointsRequired > 0:
      return "チケット利用可";
    case hasReservableTicket:
      return "チケット利用可";
    case pointsRequired !== null && pointsRequired > 0:
      return "ポイントが使える";
    default:
      return null;
  }
}

// Note: communityId parameter is kept for backwards compatibility but no longer used in URL
// The communityId is now determined from the URL path prefix (e.g., /neo88/opportunities/[id])
export const getLink = (id: string, _communityId: string, category: GqlOpportunityCategory) => {
  if (category === GqlOpportunityCategory.Activity) {
    return `/opportunities/${id}?type=activity`;
  } else if (category === GqlOpportunityCategory.Quest) {
    return `/opportunities/${id}?type=quest`;
  }
  return "";
}

