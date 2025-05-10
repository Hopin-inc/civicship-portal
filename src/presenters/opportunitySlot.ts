'use client';
import { GqlOpportunitySlot } from "@/types/graphql";
import { ActivitySlot, ActivitySlotGroup } from "@/types/opportunitySlot";

export const presenterOpportunitySlot = (
  slot: GqlOpportunitySlot,
  feeRequired: number,
): ActivitySlot => {
  return {
    id: slot.id,
    hostingStatus: slot.hostingStatus,
    feeRequired: feeRequired,

    capacity: slot.capacity ?? 0,
    remainingCapacity: slot.remainingCapacity ?? 0,

    startsAt: new Date(slot.startsAt).toISOString(),
    endsAt: new Date(slot.endsAt).toISOString(),
  };
};

export const filterSlotGroupsBySelectedDate = (
  groups: ActivitySlotGroup[],
  selectedDates: string[]
): ActivitySlotGroup[] => {
  if (!selectedDates || selectedDates.length === 0) return groups;

  return groups.filter(group => selectedDates.includes(group.dateLabel));
};

export const presenterActivitySlots = (
  slots: GqlOpportunitySlot[] | null | undefined,
  feeRequired: number
): ActivitySlot[] => {
  if (!slots || slots.length === 0) return [];
  return slots.map((slot) => presenterOpportunitySlot(slot, feeRequired));
};

export const groupActivitySlotsByDate = (
  slots: ActivitySlot[]
): ActivitySlotGroup[] => {
  const groups: Record<string, ActivitySlot[]> = {};

  for (const slot of slots) {
    const date = new Date(slot.startsAt);
    const dateLabel = date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }

    groups[dateLabel].push(slot);
  }

  return Object.entries(groups)
    .map(([dateLabel, slots]) => ({
      dateLabel,
      slots: slots.sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      ),
    }))
    .sort(
      (a, b) =>
        new Date(a.slots[0].startsAt).getTime() -
        new Date(b.slots[0].startsAt).getTime()
    );
};

export const isSlotAvailable = (slot: ActivitySlot, selectedGuests: number): boolean => {
  const remainingCapacity = slot.remainingCapacity;
  return remainingCapacity >= selectedGuests;
};

export const buildReservationParams = (
  opportunityId: string,
  communityId: string,
  slot: ActivitySlot,
  selectedGuests: number
): URLSearchParams => {
  return new URLSearchParams({
    id: opportunityId,
    community_id: communityId,
    slot_id: slot.id,
    starts_at: new Date(slot.startsAt).toISOString(),
    ends_at: new Date(slot.endsAt).toISOString(),
    guests: selectedGuests.toString(),
  });
};

