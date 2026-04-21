export type CommunityFormData = {
  // 基本情報
  originalId: string;
  name: string;

  // LINE設定
  lineAccessToken: string;
  lineChannelId: string;
  lineChannelSecret: string;
  lineLiffId: string;
};

export type ValidationErrorField =
  | "name"
  | "lineAccessToken"
  | "lineChannelId"
  | "lineChannelSecret"
  | "lineLiffId";

export type ValidationErrors = {
  [K in ValidationErrorField]?: string;
};
