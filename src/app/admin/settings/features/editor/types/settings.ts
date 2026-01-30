// 画像サイズ型
export interface ImageSize {
  width: number;
  height: number;
}

// 利用可能なすべてのフィーチャーキー
export type FeatureKey =
  | "opportunities"
  | "points"
  | "tickets"
  | "credentials"
  | "quests"
  | "places"
  | "prefectures"
  | "languageSwitcher"
  | "justDaoIt";

// フィーチャー定義型
export interface FeatureDefinition {
  key: FeatureKey;
  title: string;
  description: string;
  /** 切り替え不可（常にON） */
  disabled?: boolean;
}

// シートタイプ
export type SheetType =
  | "title"
  | "description"
  | "squareLogo"
  | "logo"
  | "ogImage"
  | "favicon"
  | null;

// 画像フィールドキー
export type ImageFieldKey = "squareLogo" | "logo" | "ogImage" | "favicon";
