'use client';

import { parseDateTime } from "@/utils/date";

export const findMatchingSlot = (slots: any, slotStartsAt: string, slotId?: string) => {
  console.log("findMatchingSlot called with:", { slotStartsAt, slotId });
  
  if (!slots) {
    console.log("Missing slots");
    return null;
  }
  
  const hasEdges = slots.edges && Array.isArray(slots.edges);
  const isArray = Array.isArray(slots);
  const slotsArray = hasEdges ? slots.edges : isArray ? slots : [];
  
  if (slotsArray.length === 0) {
    console.log("Empty slots array");
    return null;
  }
  
  if (slotId) {
    console.log("Matching by ID:", slotId);
    const foundById = slotsArray.find((item: any) => {
      const hasNode = item && item.node;
      const slot = hasNode ? item.node : item;
      return slot?.id === slotId;
    });
    
    if (foundById) {
      console.log("Found matching slot by ID:", foundById);
      if (foundById.node) {
        return foundById;
      } else {
        return { node: foundById };
      }
    }
  }
  
  console.log("ID not found, using first slot as fallback");
  const firstItem = slotsArray[0];
  const slot = firstItem.node || firstItem;
  return { node: slot };
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
