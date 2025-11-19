"use client";
import { GqlOpportunitySlot, GqlOpportunitySlotEdge } from "@/types/graphql";
import { ActivitySlot, ActivitySlotGroup } from "@/app/(authed)/reservation/data/type/opportunitySlot";
import { isDateReservable } from "@/app/(authed)/reservation/data/presenter/opportunitySlot";

export const presenterOpportunitySlots = (
  edges: (GqlOpportunitySlotEdge | null | undefined)[] | null | undefined,
): (ActivitySlot & { opportunityId: string })[] => {
  if (!edges) return [];

  return edges
    .map((edge) => {
      const node = edge?.node;
      const opportunity = node?.opportunity;

      if (!node || !opportunity) return null;

      return {
        ...presenterOpportunitySlot(node, opportunity.feeRequired ?? null),
        opportunityId: opportunity.id,
      };
    })
    .filter((slot): slot is ActivitySlot & { opportunityId: string } => slot !== null);
};

export const presenterOpportunitySlot = (
  slot: GqlOpportunitySlot,
  feeRequired: number | null,
): ActivitySlot => {
  const startsAtDate = new Date(slot.startsAt);
  const activityId = slot.opportunity?.id;
  const isReservable = isDateReservable(startsAtDate, activityId);

  return {
    id: slot.id,
    hostingStatus: slot.hostingStatus,
    feeRequired,
    opportunityId: slot.opportunity?.id ?? "",
    capacity: slot.capacity ?? 0,
    remainingCapacity: slot.remainingCapacity ?? 0,

    applicantCount: null,

    startsAt: startsAtDate.toISOString(),
    endsAt: new Date(slot.endsAt).toISOString(),

    isReservable,
  };
};

export const groupActivitySlotsByDate = (slots: ActivitySlot[]): ActivitySlotGroup[] => {
  const groups: Record<string, ActivitySlot[]> = {};

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
