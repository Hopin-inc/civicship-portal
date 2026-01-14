// src/app/admin/opportunities/constants/slot.ts

import { GqlOpportunitySlotHostingStatus } from "@/types/graphql";

/**
 * 開催ステータスのラベルマッピング
 */
export const HOSTING_STATUS_LABELS: Record<GqlOpportunitySlotHostingStatus, string> = {
  [GqlOpportunitySlotHostingStatus.Scheduled]: "開催予定",
  [GqlOpportunitySlotHostingStatus.Cancelled]: "開催中止",
  [GqlOpportunitySlotHostingStatus.Completed]: "開催終了",
} as const;

/**
 * 開催ステータスの色マッピング（admin/opportunities と同じパターン）
 */
export const HOSTING_STATUS_COLORS: Record<GqlOpportunitySlotHostingStatus, string> = {
  [GqlOpportunitySlotHostingStatus.Scheduled]: "bg-blue-500",
  [GqlOpportunitySlotHostingStatus.Cancelled]: "bg-red-500",
  [GqlOpportunitySlotHostingStatus.Completed]: "bg-gray-400",
} as const;
