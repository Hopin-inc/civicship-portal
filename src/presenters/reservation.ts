'use client';

import { parseDateTime } from "@/utils/date";

export const findMatchingSlot = (slots: any, slotStartsAt: string) => {
  if (!slots || !slotStartsAt) return null;
  
  const slotsArray = slots.edges ? slots.edges : Array.isArray(slots) ? slots : [];
  
  return slotsArray.find((item: any) => {
    const slot = item.node || item;
    if (!slot?.startsAt) return false;
    
    const slotDateTime = parseDateTime(String(slot.startsAt));
    const paramDateTime = parseDateTime(decodeURIComponent(slotStartsAt));
    
    if (!slotDateTime || !paramDateTime) return false;
    
    return slotDateTime.getTime() === paramDateTime.getTime();
  });
};

export const calculateAvailableTickets = (walletData: any, requiredUtilities: any[] | undefined) => {
  if (!requiredUtilities?.length) {
    return walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.length || 0;
  }

  const requiredUtilityIds = new Set(
    requiredUtilities.map(u => u.id)
  );

  const availableTickets = walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.filter(
    (edge: any) => {
      const utilityId = edge?.node?.utility?.id;
      return utilityId ? requiredUtilityIds.has(utilityId) : false;
    }
  ) || [];

  return availableTickets.length;
};

export const getTicketIds = (walletData: any, requiredUtilities: any[] | undefined, ticketCount: number) => {
  return walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges
    ?.filter((edge: any) => {
      if (!requiredUtilities?.length) return true;
      const utilityId = edge?.node?.utility?.id;
      return utilityId && requiredUtilities.some(u => u.id === utilityId);
    })
    ?.slice(0, ticketCount)
    ?.map((edge: any) => edge?.node?.id)
    ?.filter((id: any): id is string => id !== undefined) || [];
};
