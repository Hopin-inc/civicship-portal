"use client";
import { GqlOpportunitySlot, GqlOpportunitySlotEdge } from "@/types/graphql";
import { addDays, isAfter, endOfDay, subDays } from "date-fns";
import { ActivitySlot, ActivitySlotGroup } from "../type/opportunitySlot";
import { getAdvanceBookingDays, DEFAULT_ADVANCE_BOOKING_DAYS } from "@/config/activityBookingConfig";

/**
 * 指定された日時が予約可能かどうかを判定する
 * N日前の23:59まで予約を受け付ける（当日予約の場合は現在時刻以降）
 * @param date 判定対象の日時
 * @param activityId アクティビティID（指定されない場合はデフォルト値を使用）
 * @returns 予約可能かどうか
 */
export const isDateReservable = (date: Date | string, activityId?: string): boolean => {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const advanceBookingDays = getAdvanceBookingDays(activityId);
  const now = new Date();

  // 当日予約の場合は、閾値を現在時刻とする
  if (advanceBookingDays === 0) {
    return isAfter(targetDate, now);
  }

  // アクティビティの開催日時からN日前の日付を計算し、その日の終わりを締切とする
  const deadlineDate = subDays(targetDate, advanceBookingDays);
  const deadline = endOfDay(deadlineDate);

  return !isAfter(now, deadline); // 現在時刻が締切を過ぎていなければ予約可能
};

export const presenterOpportunitySlots = (
  edges: (GqlOpportunitySlotEdge | null | undefined)[] | null | undefined,
): ActivitySlot[] => {
  if (!edges) return [];

  return edges
    .map((edge) => {
      const node = edge?.node;
      const opportunity = node?.opportunity;

      if (!node || !opportunity) return null;

      return presenterOpportunitySlot(
        node,
        opportunity.feeRequired ?? null,
        opportunity.pointsRequired ?? null
      );
    })
    .filter((slot): slot is ActivitySlot => slot !== null);
};

export const presenterOpportunitySlot = (
  slot: GqlOpportunitySlot,
  feeRequired: number | null,
  pointsRequired: number | null,
): ActivitySlot => {
  const startsAtDate = new Date(slot.startsAt);
  const opportunityId = slot.opportunity?.id;
  const isReservable = isDateReservable(startsAtDate, opportunityId);

  return {
    id: slot.id,
    hostingStatus: slot.hostingStatus,
    feeRequired,
    pointsRequired,
    opportunityId: slot.opportunity?.id ?? "",
    capacity: slot.capacity ?? 0,
    remainingCapacity: slot.remainingCapacity ?? 0,

    applicantCount: null,

    startsAt: startsAtDate.toISOString(),
    endsAt: new Date(slot.endsAt).toISOString(),

    isReservable,
  };
};

export const filterSlotGroupsBySelectedDate = (
  groups: ActivitySlotGroup[],
  selectedDates: string[],
): ActivitySlotGroup[] => {
  if (!selectedDates || selectedDates.length === 0) return groups;

  return groups.filter((group) => selectedDates.includes(group.dateLabel));
};

export const presenterActivitySlots = (
  slots: GqlOpportunitySlot[] | null | undefined,
  feeRequired: number,
  pointsRequired: number | null,
): ActivitySlot[] => {
  if (!slots || slots.length === 0) return [];
  return slots.map((slot) => presenterOpportunitySlot(slot, feeRequired, pointsRequired));
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

export const isSlotAvailable = (slot: ActivitySlot, selectedGuests: number): boolean => {
  const remainingCapacity = slot.remainingCapacity;
  return remainingCapacity >= selectedGuests;
};

export const buildReservationParams = (
  opportunityId: string,
  communityId: string,
  slot: ActivitySlot,
  selectedGuests: number,
): URLSearchParams => {
  return new URLSearchParams({
    id: opportunityId,
    community_id: communityId,
    slot_id: slot.id,
    guests: selectedGuests.toString(),
  });
};
