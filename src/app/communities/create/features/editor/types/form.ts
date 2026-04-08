export type CommunityFormData = {
  // 基本情報
  originalId: string;
  name: string;
  imageFile: File | null;

  // メタ情報
  createdBy: string;

  // LINE設定
  lineAccessToken: string;
  lineChannelId: string;
  lineChannelSecret: string;
  lineLiffBaseUrl: string;
  lineLiffId: string;
};

export type ValidationErrorField =
  | "name"
  | "lineAccessToken"
  | "lineChannelId"
  | "lineChannelSecret"
  | "lineLiffBaseUrl"
  | "lineLiffId";

export type ValidationErrors = {
  [K in ValidationErrorField]?: string;
};
