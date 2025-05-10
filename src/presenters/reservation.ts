'use client';

import { parseDateTime } from "@/utils/date";

export const findMatchingSlot = (slots: any, slotStartsAt: string) => {
  if (!slots?.edges || !slotStartsAt) return null;
  
  return slots.edges.find((edge: any) => {
    if (!edge?.node?.startsAt) return false;
    
    const slotDateTime = parseDateTime(String(edge.node.startsAt));
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
