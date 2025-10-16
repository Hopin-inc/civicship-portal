/**
 * Presenters for reservation confirmation
 * Convert GraphQL types to UI-specific types
 */

import { GqlWallet, GqlTicket, GqlTicketStatus } from "@/types/graphql";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { toNumberSafe } from "../utils/paymentCalculations";

/**
 * 利用可能なチケット情報
 */
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

/**
 * 予約確認画面で使用するウォレット情報
 */
export interface ReservationWallet {
  currentPoint: number;
  tickets: AvailableTicket[];
}

/**
 * GraphQLウォレットデータから予約確認用のウォレット情報を生成
 * 
 * @param wallets - GraphQLから取得したウォレット配列（コミュニティでフィルタ済み）
 * @param opportunity - 機会情報（チケットフィルタリングに使用）
 * @returns 予約確認用のウォレット情報、データがない場合はnull
 */
export function presentReservationWallet(
  wallets: GqlWallet[] | null | undefined,
  opportunity: ActivityDetail | QuestDetail | null,
): ReservationWallet | null {
  if (!wallets || wallets.length === 0) return null;
  
  const memberWallet = wallets[0];
  
  const currentPoint = toNumberSafe(memberWallet?.currentPointView?.currentPoint, 0);
  const allTickets = (memberWallet?.tickets as GqlTicket[]) ?? [];
  const tickets = presentAvailableTickets(allTickets, opportunity);
  
  return {
    currentPoint,
    tickets,
  };
}

/**
 * GraphQLチケットを利用可能チケット形式に変換
 * 
 * @param tickets - GraphQLチケット配列
 * @param opportunity - 機会情報（対象ユーティリティでフィルタ）
 * @returns 利用可能チケット配列
 */
function presentAvailableTickets(
  tickets: GqlTicket[],
  opportunity: ActivityDetail | QuestDetail | null,
): AvailableTicket[] {
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

  return groupedTickets.filter((t) => {
    const utilityId = t?.utility?.id;
    const hasRequiredUtility = utilityId && requiredUtilityIds.has(utilityId);
    const isAvailable = t.status === GqlTicketStatus.Available;
    return hasRequiredUtility && isAvailable;
  });
}

/**
 * Convert GraphQL wallets to current point value
 * @deprecated Use presentReservationWallet instead
 */
export function presentUserWallet(wallets: Array<{ type: string; currentPointView?: { currentPoint?: unknown } | null }> | null | undefined): number | null {
  if (!wallets) {
    return null;
  }

  const memberWallet = wallets.find((w: { type: string }) => w.type === "MEMBER");
  return toNumberSafe(memberWallet?.currentPointView?.currentPoint as number | bigint | null | undefined) ?? null;
}
