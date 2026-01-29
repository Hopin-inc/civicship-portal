import { COMMUNITY_PRD_CONFIGS } from "@/lib/communities/configs/prd";
import { COMMUNITY_DEV_CONFIGS } from "@/lib/communities/configs/dev";
import { COMMUNITY_LOCAL_CONFIGS } from "@/lib/communities/configs/local";

export const DEFAULT_ASSET_PATHS = {
  LOGO: "/communities/default/logo.jpg",
  SQUARE_LOGO: "/communities/default/logo-square.jpg",
  FAVICON: "/communities/default/favicon.ico",
  APPLE_TOUCH_ICON: "/communities/default/apple-touch-icon.png",
} as const;

const getActiveConfigs = () => {
  // 生の値をログに出す（サーバーのターミナルを確認してください）
  console.log("--- Config Debug ---");
  console.log("NODE_ENV (raw):", process.env.NODE_ENV);
  console.log("ENV (raw):", process.env.ENV);

  // 明示的な判定用定数
  const isPrd = process.env.NODE_ENV === "production";
  const envValue = process.env.ENV;

  console.log("isPrd check:", isPrd);
  console.log("envValue check:", envValue);

  // もし isPrd が true になっていたら、なぜそうなったかを探る
  if (isPrd) {
    console.log("Returning: COMMUNITY_PRD_CONFIGS");
    return COMMUNITY_PRD_CONFIGS;
  }

  if (envValue !== "LOCAL") {
    console.log("Returning: COMMUNITY_DEV_CONFIGS");
    return COMMUNITY_DEV_CONFIGS;
  }

  console.log("Returning: COMMUNITY_LOCAL_CONFIGS (Merged)");
  return { ...COMMUNITY_DEV_CONFIGS, ...COMMUNITY_LOCAL_CONFIGS };
};

export const COMMUNITY_CONFIGS = getActiveConfigs();

/**
 * プロジェクトに存在する全てのコミュニティIDの型定義
 * DEVの設定にあるキーをマスターリストとして使用
 */
export type CommunityId = keyof typeof COMMUNITY_DEV_CONFIGS;
