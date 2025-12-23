import { GqlOpportunitySlotHostingStatus } from "@/types/graphql";
import { SlotData } from "../types";

/**
 * スロットが削除可能かどうかを判定
 * DB未登録（IDまたはステータスがない）場合のみ削除可能
 */
export const canDeleteSlot = (slot: SlotData): boolean => {
  return !slot.id || !slot.hostingStatus;
};

/**
 * スロットが開催中止可能かどうかを判定
 * SCHEDULED状態の場合のみ中止可能
 */
export const canCancelSlot = (slot: SlotData): boolean => {
  return slot.hostingStatus === GqlOpportunitySlotHostingStatus.Scheduled;
};

/**
 * スロットにアクションボタンが表示されないかどうかを判定
 * CANCELLEDまたはCOMPLETED状態の場合、アクションなし
 */
export const hasNoSlotActions = (slot: SlotData): boolean => {
  return (
    slot.hostingStatus === GqlOpportunitySlotHostingStatus.Cancelled ||
    slot.hostingStatus === GqlOpportunitySlotHostingStatus.Completed
  );
};
