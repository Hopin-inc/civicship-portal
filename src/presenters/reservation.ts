'use client';

import { ActivitySlot } from "@/types/opportunitySlot";
import { GqlTicket, GqlWallet } from "@/types/graphql";
import { RequiredUtility } from "@/types/opportunity";

export const findMatchingSlot = (
  slots: ActivitySlot[],
  slotId?: string
): ActivitySlot | null => {
  if (!Array.isArray(slots) || slots.length === 0) {
    return null;
  }

  if (slotId) {
    const match = slots.find((slot) => slot.id === slotId);
    if (match) {
      return match;
    }
  }

  return slots[0] ;
};

export const getTicketIds = (wallets: GqlWallet[] | null, requiredUtilities: RequiredUtility[] | undefined, ticketCount: number) => {
  return wallets?.[0]?.tickets
    ?.filter((edge: GqlTicket) => {
      if (!requiredUtilities?.length) return true;
      const utilityId = edge?.utility?.id;
      return utilityId && requiredUtilities.some(u => u.id === utilityId);
    })
    ?.slice(0, ticketCount)
    ?.map((edge: GqlTicket) => edge?.id)
    ?.filter((id) => id !== undefined) || [];
};
