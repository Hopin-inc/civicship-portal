export type CommunityFormData = {
  // 基本情報
  name: string;
  pointName: string;
  bio: string;
  website: string;
  imageFile: File | null;

  // メタ情報
  establishedAt: string; // ISO date string or empty
  originalId: string;
  createdBy: string;

  // LINE設定
  lineAccessToken: string;
  lineChannelId: string;
  lineChannelSecret: string;
  lineLiffBaseUrl: string;
  lineLiffId: string;
};

export type ValidationErrorField = "name" | "pointName";

export type ValidationErrors = {
  [K in ValidationErrorField]?: string;
};
