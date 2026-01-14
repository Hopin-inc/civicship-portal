"use client";

import { Ticket, TicketClaimLink } from "@/app/tickets/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { getCommunityIdFromEnv } from "@/lib/communities/metadata";
import { GqlWallet } from "@/types/graphql";

export const transformTickets = (data: any): Ticket[] => {
  return (
    data?.user?.wallets?.edges?.find((w: GqlWallet) => w.community?.id === getCommunityIdFromEnv())?.node?.tickets?.edges?.map((edge: any) => ({
      id: edge?.node?.id,
      status: edge?.node?.status,
      hostName: edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser?.name || "不明",
      hostImage:
        edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser?.image ||
        PLACEHOLDER_IMAGE,
      quantity: 1,
    })) || []
  );
};

/**
 * Transform TicketClaimLink data from GraphQL to display format
 */
export const transformTicketClaimLinks = (connection: any): TicketClaimLink[] => {
  return (
    connection?.edges?.map((edge: any) => {
      const availableTickets = edge?.node?.tickets?.filter((ticket: any) => ticket.status === "AVAILABLE") || [];
      return {
        id: edge?.node?.id,
        status: edge?.node?.status,
        qty: availableTickets.length,
        claimedAt: edge?.node?.claimedAt,
        createdAt: edge?.node?.createdAt,
        hostName: edge?.node?.issuer?.owner?.name || "不明",
        hostImage: edge?.node?.issuer?.owner?.image || PLACEHOLDER_IMAGE,
        issuer: edge?.node?.issuer,
      };
    }) || []
  );
};
