import { ActivitySlot, QuestSlot } from "@/app/[communityId]/reservation/data/type/opportunitySlot";
import { parseDateTime } from "@/utils/date";

/**
 * スロットの日付範囲
 */
export interface SlotDateRange {
  startDateTime: Date | null;
  endDateTime: Date | null;
}

/**
 * スロットから日付範囲を抽出
 * 
 * @param slot - 機会スロット
 * @returns 日付範囲
 */
export function parseSlotDateRange(
  slot: ActivitySlot | QuestSlot | null
): SlotDateRange {
  if (!slot) {
    return {
      startDateTime: null,
      endDateTime: null,
    };
  }

  const startDateTime = slot.startsAt ? parseDateTime(String(slot.startsAt)) : null;
  const endDateTime = slot.endsAt ? parseDateTime(String(slot.endsAt)) : null;
  
  return { startDateTime, endDateTime };
}

/**
 * スロット一覧から特定IDのスロットを検索
 * 
 * @param slots - スロット一覧
 * @param slotId - 検索するスロットID
 * @returns 見つかったスロット、または null
 */
export function findSlotById(
  slots: (ActivitySlot | QuestSlot)[],
  slotId: string | undefined,
): ActivitySlot | QuestSlot | null {
  if (!slotId) return null;
  return slots.find((slot) => slot.id === slotId) ?? null;
}
