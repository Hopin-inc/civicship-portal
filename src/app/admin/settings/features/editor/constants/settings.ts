import { FeatureDefinition, ImageFieldKey, ImageSize } from "../types/settings";

// 画像サイズ定義
export const IMAGE_SIZES: Record<ImageFieldKey, ImageSize> = {
  squareLogo: { width: 512, height: 512 },
  logo: { width: 1280, height: 512 },
  ogImage: { width: 1200, height: 630 },
  favicon: { width: 32, height: 32 },
} as const;

// フィーチャー定義
export const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  {
    key: "points",
    title: "ポイント",
    description: "独自のポイントを発行し、コミュニティ内での感謝や活動の循環を可視化します。",
    disabled: true, // 常にON
  },
  {
    key: "tickets",
    title: "チケット",
    description: "知り合いを体験に無料招待できる仕組みを導入。縁を広げるきっかけを作れます。",
  },
  {
    key: "opportunities",
    title: "募集",
    description:
      "コミュニティメンバーが気軽に参加できる「体験・お手伝い」の募集ページを公開します。",
  },
  {
    key: "credentials",
    title: "証明書発行",
    description: "募集への参加実績をデジタル証明書(VC)として発行。活動の証を形に残せます。",
  },
  {
    key: "places",
    title: "拠点",
    description: "活動場所を地図上に表示。近くにいる人たちがあなたの拠点を見つけやすくなります。",
  },
];

// 画像フィールド設定
export const IMAGE_FIELD_CONFIG: Record<
  ImageFieldKey,
  { title: string; editTitle: string; description: string; acceptSvg?: boolean }
> = {
  squareLogo: {
    title: "ロゴ(正方形)",
    editTitle: "ロゴ(正方形)を編集",
    description: "正方形のロゴ画像をアップロードしてください",
  },
  logo: {
    title: "ロゴ(横長)",
    editTitle: "ロゴ(横長)を編集",
    description: "横長のロゴ画像をアップロードしてください",
  },
  ogImage: {
    title: "OG画像",
    editTitle: "OG画像を編集",
    description: "SNSシェア時に表示される画像をアップロードしてください",
  },
  favicon: {
    title: "ファビコン",
    editTitle: "ファビコンを編集",
    description: "ファビコン画像をアップロードしてください（SVG推奨）",
    acceptSvg: true,
  },
};
