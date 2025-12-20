// src/app/admin/opportunities/constants/opportunity.ts

import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";

/**
 * 公開ステータスのラベルマッピング
 */
export const PUBLISH_STATUS_LABELS: Record<GqlPublishStatus, string> = {
  [GqlPublishStatus.Public]: "公開中",
  [GqlPublishStatus.CommunityInternal]: "限定公開",
  [GqlPublishStatus.Private]: "非公開",
} as const;

/**
 * カテゴリーのラベルマッピング
 */
export const OPPORTUNITY_CATEGORY_LABELS: Record<GqlOpportunityCategory, string> = {
  [GqlOpportunityCategory.Activity]: "体験",
  [GqlOpportunityCategory.Quest]: "お手伝い",
  [GqlOpportunityCategory.Event]: "イベント",
} as const;

/**
 * 公開ステータスの色マッピング（Tailwind classes）
 */
export const PUBLISH_STATUS_COLORS: Record<GqlPublishStatus, string> = {
  [GqlPublishStatus.Public]: "bg-green-500",
  [GqlPublishStatus.CommunityInternal]: "bg-blue-500",
  [GqlPublishStatus.Private]: "bg-gray-400",
} as const;
