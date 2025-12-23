import dayjs from "dayjs";
import { SlotData } from "../types";

/**
 * 月ごとにグルーピングされたスロット
 */
export type GroupedSlots = Record<string, Array<{ slot: SlotData; index: number }>>;

/**
 * スロットを月ごとにグルーピング
 */
export function groupSlotsByMonth(slots: SlotData[]): GroupedSlots {
  const grouped: GroupedSlots = {};

  slots.forEach((slot, index) => {
    const monthKey = dayjs(slot.startAt).format("YYYY-MM");
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push({ slot, index });
  });

  return grouped;
}

/**
 * 月キーを表示用フォーマットに変換
 */
export function formatMonthHeader(monthKey: string, count: number): string {
  const [year, month] = monthKey.split("-");
  return `${year}年${parseInt(month)}月（${count}件）`;
}
