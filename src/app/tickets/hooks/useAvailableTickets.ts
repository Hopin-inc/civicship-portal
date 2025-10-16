"use client";

import { useMemo } from "react";
import { GqlTicketStatus, GqlTicket } from "@/types/graphql";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";

export interface AvailableTicket {
  id: string;
  utility: {
    id: string;
    name: string | null;
    owner: {
      id: string;
      name: string;
    } | null;
  } | null;
  status: GqlTicketStatus;
  count: number;
}

export const useAvailableTickets = (
  opportunity: ActivityDetail | QuestDetail | null,
  tickets: GqlTicket[]
): AvailableTicket[] => {
  return useMemo(() => {
    const ticketGroups = new Map<string, GqlTicket[]>();
    tickets.forEach((ticket) => {
      const utilityId = ticket.utility?.id || "unknown";
      if (!ticketGroups.has(utilityId)) {
        ticketGroups.set(utilityId, []);
      }
      ticketGroups.get(utilityId)!.push(ticket);
    });

    const groupedTickets = Array.from(ticketGroups.entries()).map(
      ([utilityId, ticketList]) => {
        const firstTicket = ticketList[0];
        const availableTickets = ticketList.filter(
          (ticket) => ticket.status === GqlTicketStatus.Available
        );

        return {
          id: utilityId,
          utility: firstTicket.utility
            ? {
                id: firstTicket.utility.id,
                name: firstTicket.utility.name ?? null,
                owner: firstTicket.utility.owner ?? null,
              }
            : null,
          status:
            availableTickets.length > 0
              ? GqlTicketStatus.Available
              : firstTicket.status,
          count: availableTickets.length,
        };
      }
    );

    if (!opportunity?.targetUtilities.length) {
      return groupedTickets;
    }

    const requiredUtilityIds = new Set(
      opportunity.targetUtilities.map((u) => u.id)
    );

    const filteredTickets = groupedTickets.filter((t) => {
      const utilityId = t?.utility?.id;
      const hasRequiredUtility = utilityId && requiredUtilityIds.has(utilityId);
      const isAvailable = t.status === GqlTicketStatus.Available;

      return hasRequiredUtility && isAvailable;
    });

    return filteredTickets;
  }, [opportunity?.targetUtilities, tickets]);
};
