"use client";
import {
  GqlOpportunityCategory,
  GqlOpportunitySlot,
  GqlOpportunitySlotEdge,
} from "@/types/graphql";
import {
  ActivitySlot,
  ActivitySlotGroup,
  IOpportunitySlot,
} from "@/app/reservation/data/type/opportunitySlot";
import { addDays, isAfter } from "date-fns";

export const presenterOpportunitySlots = (
  edges: (GqlOpportunitySlotEdge | null | undefined)[] | null | undefined,
): IOpportunitySlot[] => {
  if (!edges) return [];

  return edges
    .map((edge) => {
      const node = edge?.node;
      const opportunity = node?.opportunity;

      if (!node || !opportunity) return null;

      return presenterOpportunitySlot(
        node,
        opportunity.category,
        opportunity.feeRequired ?? null,
        opportunity.pointsToEarn ?? null,
      );
    })
    .filter((slot): slot is ActivitySlot => slot !== null);
};

export const presenterOpportunitySlot = (
  slot: GqlOpportunitySlot,
  category: GqlOpportunityCategory,
  feeRequired: number | null,
  pointsToEarn: number | null,
): IOpportunitySlot => {
  const startsAtDate = new Date(slot.startsAt);
  const threshold = addDays(new Date(), 7);
  const isReservable = isAfter(startsAtDate, threshold);

  const base = {
    id: slot.id,
    hostingStatus: slot.hostingStatus,
    capacity: slot.capacity ?? 0,
    remainingCapacity: slot.remainingCapacity ?? 0,
    applicantCount: null,
    startsAt: startsAtDate.toISOString(),
    endsAt: new Date(slot.endsAt).toISOString(),
    isReservable,
  };

  if (category === GqlOpportunityCategory.Quest) {
    return {
      ...base,
      pointsToEarn: pointsToEarn ?? null,
    };
  }

  return {
    ...base,
    feeRequired: feeRequired ?? null,
  };
};

export const filterSlotGroupsBySelectedDate = (
  groups: ActivitySlotGroup[],
  selectedDates: string[],
): ActivitySlotGroup[] => {
  if (!selectedDates || selectedDates.length === 0) return groups;

  return groups.filter((group) => selectedDates.includes(group.dateLabel));
};

export const groupActivitySlotsByDate = (slots: IOpportunitySlot[]): ActivitySlotGroup[] => {
  const groups: Record<string, IOpportunitySlot[]> = {};

  for (const slot of slots) {
    const date = new Date(slot.startsAt);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = date.toLocaleDateString("ja-JP", { weekday: "narrow" }); // "水"
    const dateLabel = `${month}月${day}日（${weekday}）`; // ← 全角括弧に！

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }

    groups[dateLabel].push(slot);
  }

  return Object.entries(groups)
    .map(([dateLabel, slots]) => ({
      dateLabel,
      slots: slots.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    }))
    .sort(
      (a, b) => new Date(a.slots[0].startsAt).getTime() - new Date(b.slots[0].startsAt).getTime(),
    );
};

export const buildReservationParams = (
  opportunityId: string,
  communityId: string,
  slot: IOpportunitySlot,
  selectedGuests: number,
): URLSearchParams => {
  return new URLSearchParams({
    id: opportunityId,
    community_id: communityId,
    slot_id: slot.id,
    guests: selectedGuests.toString(),
  });
};
