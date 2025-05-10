'use client';

import { parseDateTime } from "@/utils/date";

export const findMatchingSlot = (slots: any, slotStartsAt: string) => {
  console.log("findMatchingSlot called with slotStartsAt:", slotStartsAt);
  console.log("Slots structure:", slots);
  
  if (!slots || !slotStartsAt) {
    console.log("Missing slots or slotStartsAt");
    return null;
  }
  
  const hasEdges = slots.edges && Array.isArray(slots.edges);
  const isArray = Array.isArray(slots);
  
  console.log("Slots structure type:", { hasEdges, isArray });
  
  const slotsArray = hasEdges ? slots.edges : isArray ? slots : [];
  
  console.log("Slots array length:", slotsArray.length);
  if (slotsArray.length > 0) {
    console.log("First slot sample:", JSON.stringify(slotsArray[0]));
  }
  
  const foundItem = slotsArray.find((item: any) => {
    const hasNode = item && item.node;
    const slot = hasNode ? item.node : item;
    
    if (!slot?.startsAt) {
      console.log("Slot missing startsAt:", slot);
      return false;
    }
    
    const slotDateTime = parseDateTime(String(slot.startsAt));
    const paramDateTime = parseDateTime(decodeURIComponent(slotStartsAt));
    
    console.log("Comparing dates:", {
      slotStartsAt: slot.startsAt,
      paramStartsAt: slotStartsAt,
      slotDateTime,
      paramDateTime
    });
    
    if (!slotDateTime || !paramDateTime) {
      console.log("Invalid date format");
      return false;
    }
    
    const isMatch = slotDateTime.getTime() === paramDateTime.getTime();
    if (isMatch) {
      console.log("Found matching slot!");
    }
    
    return isMatch;
  });
  
  console.log("findMatchingSlot result:", foundItem);
  
  if (!foundItem && slotsArray.length > 0) {
    console.log("No match found, creating fake node for debugging");
    const firstItem = slotsArray[0];
    const slot = firstItem.node || firstItem;
    return { node: slot };
  }
  
  return foundItem;
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
