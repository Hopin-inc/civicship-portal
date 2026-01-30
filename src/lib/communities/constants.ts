import { CommunityPortalConfig } from "@/lib/communities/config";

export const DEFAULT_ASSET_PATHS = {
  LOGO: "/communities/default/logo.jpg",
  SQUARE_LOGO: "/communities/default/logo-square.jpg",
  FAVICON: "/communities/default/favicon.ico",
  APPLE_TOUCH_ICON: "/communities/default/apple-touch-icon.png",
  OG_IMAGE: "/communities/default/ogp.png",
} as const;

export const ACTIVE_COMMUNITY_IDS = [
  "neo88",
  "kibotcha",
  "dais",
  "kotohira",
  "himeji-ymca",
  "izu",
  "ubuyama",
] as const;

export const COMMUNITY_LOCAL_CONFIGS: CommunityPortalConfig = {
  communityId: "himeji-ymca",

  title: "姫路YMCA",
  tokenName: "姫路YMCA",
  description: "",
  shortDescription: "",
  domain: "https://himeji-ymca.civicship.jp",

  faviconPrefix: "/communities/himeji-ymca",
  logoPath: "/communities/himeji-ymca/logo.jpg",
  squareLogoPath: "/communities/himeji-ymca/logo-square.jpg",
  ogImagePath:
    "https://storage.googleapis.com/prod-civicship-storage-public/asset/himeji-ymca/ogp.jpg",

  enableFeatures: ["points", "opportunities", "quests"],

  rootPath: "/users/me",
  adminRootPath: "/admin/wallet",

  documents: null,
  commonDocumentOverrides: null,

  regionName: null,
  regionKey: null,

  firebaseTenantId: "himeji-ymca-5pdjx",
  liffId: "2007838818",
  liffAppId: "2007838818-VR4yRvgL",
  liffBaseUrl: "https://liff.line.me/2007838818-VR4yRvgL",
};
