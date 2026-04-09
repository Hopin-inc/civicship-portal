export type CommunityFormData = {
  // 基本情報
  originalId: string;
  name: string;
  imageFile: File | null;

  // Messaging API
  lineAccessToken: string;
  lineChannelId: string;
  lineChannelSecret: string;
  lineLiffId: string;

  // LINE Login
  lineLoginChannelId: string;
  lineLoginChannelSecret: string;
};

export type ValidationErrorField =
  | "name"
  | "lineAccessToken"
  | "lineChannelId"
  | "lineChannelSecret"
  | "lineLiffId"
  | "lineLoginChannelId"
  | "lineLoginChannelSecret";

export type ValidationErrors = {
  [K in ValidationErrorField]?: string;
};
