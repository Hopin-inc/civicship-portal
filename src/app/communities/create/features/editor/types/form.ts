export type CommunityFormData = {
  // 基本情報
  originalId: string;
  name: string;
  imageFile: File | null;

  // LINE設定
  lineAccessToken: string;
  lineLiffId: string;
  lineChannelId: string;    // LINE Login Channel ID
  lineChannelSecret: string; // LINE Login Channel Secret
};

export type ValidationErrorField =
  | "name"
  | "lineAccessToken"
  | "lineLiffId"
  | "lineChannelId"
  | "lineChannelSecret";

export type ValidationErrors = {
  [K in ValidationErrorField]?: string;
};
