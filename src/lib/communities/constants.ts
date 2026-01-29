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
  const env = process.env.ENV;
  const isPrd = process.env.NODE_ENV === "production";

  if (env === "LOCAL") {
    return { ...COMMUNITY_DEV_CONFIGS, ...COMMUNITY_LOCAL_CONFIGS };
  }

  if (isPrd && env === "staging") {
    return COMMUNITY_DEV_CONFIGS;
  }

  return COMMUNITY_PRD_CONFIGS;
};

export const COMMUNITY_CONFIGS = getActiveConfigs();

/**
 * プロジェクトに存在する全てのコミュニティIDの型定義
 * DEVの設定にあるキーをマスターリストとして使用
 */
export type CommunityId = keyof typeof COMMUNITY_DEV_CONFIGS;
