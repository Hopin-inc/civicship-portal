import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";

export type OpportunityFormData = {
  // 基本情報
  category: GqlOpportunityCategory;
  title: string;
  summary: string;
  description: string;

  // 主催・場所
  hostUserId: string;
  placeId: string | null;
  requireHostApproval: boolean;

  // 募集条件（共通）
  capacity: number;

  // 募集条件（Activity専用）
  feeRequired?: number;
  pointsRequired?: number;

  // 募集条件（Quest専用）
  pointsToEarn?: number;

  // 開催枠
  slots: SlotData[];

  // 画像
  images: ImageData[];

  // 公開設定
  publishStatus: GqlPublishStatus;
};

export type SlotData = {
  id?: string;
  startAt: string;
  endAt: string;
};

export type ImageData = {
  url: string;
  file?: File;
  alt?: string;
  caption?: string;
};

export type HostOption = {
  id: string;
  name: string;
};

export type PlaceOption = {
  id: string;
  label: string;
};
