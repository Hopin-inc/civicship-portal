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

export const getLink = (id: string, communityId: string, category: GqlOpportunityCategory) => {
  if (category === GqlOpportunityCategory.Activity) {
    return `/opportunities/${id}?community_id=${communityId}&type=activity`;
  } else if (category === GqlOpportunityCategory.Quest) {
    return `/opportunities/${id}?community_id=${communityId}&type=quest`;
  }
  return "";
}

