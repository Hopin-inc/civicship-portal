"use client";

import { useMemo } from "react";
import { GqlTicketStatus, useGetUserWalletQuery } from "@/types/graphql";
import { ActivityDetail, QuestDetail } from "@/app/activities/data/type";
import { getCommunityIdFromEnv } from "@/lib/communities/metadata";

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
  count: number; // 同じチケットの枚数
}

export const useAvailableTickets = (
  opportunity: ActivityDetail | QuestDetail | null,
  userId: string | undefined,
): AvailableTicket[] => {
  const { data } = useGetUserWalletQuery({
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });

  return useMemo(() => {
    const tickets = data?.user?.wallets?.find(w => w.community?.id === getCommunityIdFromEnv())?.tickets || [];
    
    // 同じチケットIDでグループ化
    const ticketGroups = new Map<string, any[]>();
    tickets.forEach(ticket => {
      const utilityId = ticket.utility?.id || 'unknown';
      if (!ticketGroups.has(utilityId)) {
        ticketGroups.set(utilityId, []);
      }
      ticketGroups.get(utilityId)!.push(ticket);
    });

    const groupedTickets = Array.from(ticketGroups.entries()).map(([utilityId, ticketList]) => {
      const firstTicket = ticketList[0];
      // AVAILABLEステータスのチケットのみをカウント
      const availableTickets = ticketList.filter(ticket => ticket.status === GqlTicketStatus.Available);
      
      return {
        id: utilityId,
        utility: firstTicket.utility ? {
          id: firstTicket.utility.id,
          name: firstTicket.utility.name ?? null,
          owner: firstTicket.utility.owner ?? null
        } : null,
        status: availableTickets.length > 0 ? GqlTicketStatus.Available : firstTicket.status,
        count: availableTickets.length // AVAILABLEステータスのチケット数
      };
    });
    
    if (!opportunity?.targetUtilities.length) {
      return groupedTickets;
    }

    const requiredUtilityIds = new Set(opportunity.targetUtilities.map((u) => u.id));

    const filteredTickets = groupedTickets.filter((t) => {
      const utilityId = t?.utility?.id;
      const hasRequiredUtility = utilityId && requiredUtilityIds.has(utilityId);
      const isAvailable = t.status === GqlTicketStatus.Available;
      
      return hasRequiredUtility && isAvailable;
    });
    
    return filteredTickets;
  }, [opportunity?.targetUtilities, data]);
};
