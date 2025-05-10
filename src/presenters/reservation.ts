'use client';

import { parseDateTime } from "@/utils/date";

export const findMatchingSlot = (slots: any, slotStartsAt: string, slotId?: string) => {
  console.log("findMatchingSlot called with:", { slotStartsAt, slotId });
  console.log("Slots structure:", slots);
  
  if (!slots) {
    console.log("Missing slots");
    return null;
  }
  
  if (!slotStartsAt && !slotId) {
    console.log("Missing both slotStartsAt and slotId");
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
  
  if (slotId) {
    console.log("Attempting to match by ID:", slotId);
    const foundById = slotsArray.find((item: any) => {
      const hasNode = item && item.node;
      const slot = hasNode ? item.node : item;
      return slot?.id === slotId;
    });
    
    if (foundById) {
      console.log("Found matching slot by ID!");
      return foundById;
    }
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
    
    const slotHour = slotDateTime.getHours();
    const paramHour = paramDateTime.getHours();
    const slotDay = slotDateTime.getDate();
    const paramDay = paramDateTime.getDate();
    const slotMonth = slotDateTime.getMonth();
    const paramMonth = paramDateTime.getMonth();
    
    const isMatch = slotHour === paramHour && 
                    slotDay === paramDay && 
                    slotMonth === paramMonth;
    
    if (isMatch) {
      console.log("Found matching slot by timestamp!");
    }
    
    return isMatch;
  });
  
  console.log("findMatchingSlot result:", foundItem);
  
  if (foundItem) {
    if (foundItem.node) {
      console.log("Returning existing node structure");
      return foundItem;
    } else {
      console.log("Wrapping slot in node structure");
      return { node: foundItem };
    }
  }
  
  if (slotsArray.length > 0) {
    console.log("No match found, creating node structure from first slot");
    const firstItem = slotsArray[0];
    const slot = firstItem.node || firstItem;
    return { node: slot };
  }
  
  return null;
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
