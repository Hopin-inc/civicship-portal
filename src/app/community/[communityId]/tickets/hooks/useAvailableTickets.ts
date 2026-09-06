"use client";

import { useMemo } from "react";
import { GqlTicket, GqlTicketStatus } from "@/types/graphql";
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
  ticketsInput: GqlTicket[] | { edges?: { node: GqlTicket }[] } | null | undefined,
): AvailableTicket[] => {
  return useMemo(() => {
    // ✅ 1. ticketsInputが配列構造かedges構造かを吸収してフラット化
    const tickets: GqlTicket[] = Array.isArray(ticketsInput)
      ? ticketsInput
      : (ticketsInput?.edges?.map((e) => e.node) ?? []);

    // ✅ 2. 空なら即リターン
    if (tickets.length === 0) return [];

    // ✅ 3. チケットをutilityごとにグループ化
    const ticketGroups = new Map<string, GqlTicket[]>();
    tickets.forEach((ticket) => {
      const utilityId = ticket.utility?.id || "unknown";
      if (!ticketGroups.has(utilityId)) {
        ticketGroups.set(utilityId, []);
      }
      ticketGroups.get(utilityId)!.push(ticket);
    });

    // ✅ 4. グループごとにAvailable数などを集計
    const groupedTickets = Array.from(ticketGroups.entries()).map(([utilityId, ticketList]) => {
      const firstTicket = ticketList[0];
      const availableTickets = ticketList.filter(
        (ticket) => ticket.status === GqlTicketStatus.Available,
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
        status: availableTickets.length > 0 ? GqlTicketStatus.Available : firstTicket.status,
        count: availableTickets.length,
      };
    });

    // ✅ 5. 対象Utilityフィルタリング
    // utility を要求していない募集はチケットを受け付けない。API 側は
    // requiredUtilities が空だとチケット決済の処理ごと素通りするため、ここで
    // 出してしまうと「チケットで支払う」トグルと割引後の金額だけが表示され、
    // 予約は通るのにチケットは消費されない。opportunity 自体が未確定の場合は
    // 絞り込む材料がないので従来どおり全件返す。
    if (!opportunity) return groupedTickets;
    if (!opportunity.targetUtilities?.length) return [];

    const requiredUtilityIds = new Set(opportunity.targetUtilities.map((u) => u.id));

    return groupedTickets.filter((t) => {
      const utilityId = t?.utility?.id;
      const hasRequiredUtility = utilityId && requiredUtilityIds.has(utilityId);
      const isAvailable = t.status === GqlTicketStatus.Available;

      return hasRequiredUtility && isAvailable;
    });
  }, [opportunity, ticketsInput]);
};
