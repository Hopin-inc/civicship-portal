import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";

export type OpportunityFormData = {
  // 基本情報
  category: GqlOpportunityCategory;
  title: string;
  summary: string;
  description: string;

  // 主催・場所
  hostUserId: string;
  hostName?: string | null;
  placeId: string | null;
  placeName?: string | null;
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

// 判別可能ユニオン型による画像データ
export type NewImage = {
  type: 'new';
  file: File;
  url: string; // blob URL
};

export type ExistingImage = {
  type: 'existing';
  url: string; // server URL
};

export type ImageData = NewImage | ExistingImage;

// 型ガード関数
export function isNewImage(img: ImageData): img is NewImage {
  return img.type === 'new';
}

export function isExistingImage(img: ImageData): img is ExistingImage {
  return img.type === 'existing';
}

// バリデーションエラー型
export type ValidationErrorField = 'title' | 'summary' | 'hostUserId';

export type ValidationErrors = {
  [K in ValidationErrorField]?: string;
};

export type HostOption = {
  id: string;
  name: string;
};

export type PlaceOption = {
  id: string;
  label: string;
};

// フォーム編集モード
export type FormEditMode = 'form' | 'slots';
