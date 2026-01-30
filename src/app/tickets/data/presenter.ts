"use client";

import { TicketClaimLink } from "@/app/tickets/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";

/**
 * Transform TicketClaimLink data from GraphQL to display format
 */
export const transformTicketClaimLinks = (connection: any): TicketClaimLink[] => {
  return (
    connection?.edges?.map((edge: any) => {
      const availableTickets =
        edge?.node?.tickets?.filter((ticket: any) => ticket.status === "AVAILABLE") || [];
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
