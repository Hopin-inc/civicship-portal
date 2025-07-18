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
      return {
        id: utilityId, // firstTicket.idからutilityIdに変更
        utility: firstTicket.utility ? {
          id: firstTicket.utility.id,
          name: firstTicket.utility.name ?? null,
          owner: firstTicket.utility.owner ?? null
        } : null,
        status: firstTicket.status,
        count: ticketList.length
      };
    });
    
    if (!opportunity?.targetUtilities.length) {
      return groupedTickets;
    }

    const requiredUtilityIds = new Set(opportunity.targetUtilities.map((u) => u.id));

    return groupedTickets.filter((t) => {
      const utilityId = t?.utility?.id;
      return utilityId && requiredUtilityIds.has(utilityId) && t.status === GqlTicketStatus.Available;
    });
  }, [opportunity?.targetUtilities, data]);
};
