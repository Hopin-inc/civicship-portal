import { GqlGetTicketsQuery } from "@/types/graphql";
import { TTicket } from "@/app/tickets/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";

export const transformTickets = (data: GqlGetTicketsQuery | undefined): TTicket[] => {
  const edges = data?.tickets.edges ?? [];

  return edges
    .map((edge) => {
      const node = edge?.node;
      if (!node) return null;

      return {
        id: node.id,
        status: node.status,
        hostName: node.claimLink?.issuer?.owner?.name || "不明",
        hostImage: node.claimLink?.issuer?.owner?.image || PLACEHOLDER_IMAGE,
        quantity: 1,
      };
    })
    .filter((t): t is TTicket => t !== null); // null を除去
};
