"use client";

import { Ticket, TicketClaimLink } from "@/app/tickets/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";

/**
 * Transform wallet data from GraphQL to tickets array
 */
export const transformTickets = (data: any): Ticket[] => {
  return (
    data?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.map((edge: any) => ({
      id: edge?.node?.id,
      status: edge?.node?.status,
      utilityId: edge?.node?.utility?.id,
      hostName: edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser?.name || "不明",
      hostImage:
        edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser?.image ||
        PLACEHOLDER_IMAGE,
      quantity: 1,
      createdByUser: edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser,
    })) || []
  );
};

/**
 * Transform TicketClaimLink data from GraphQL to display format
 */
export const transformTicketClaimLinks = (connection: any): TicketClaimLink[] => {
  return (
    connection?.edges?.map((edge: any) => ({
      id: edge?.node?.id,
      status: edge?.node?.status,
      qty: edge?.node?.qty,
      claimedAt: edge?.node?.claimedAt,
      createdAt: edge?.node?.createdAt,
      hostName: edge?.node?.issuer?.owner?.name || "不明",
      hostImage: edge?.node?.issuer?.owner?.image || PLACEHOLDER_IMAGE,
      issuer: edge?.node?.issuer,
    })) || []
  );
};
