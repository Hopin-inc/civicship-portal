export const DEFAULT_ASSET_PATHS = {
  LOGO: "/communities/default/logo.jpg",
  SQUARE_LOGO: "/communities/default/logo-square.jpg",
  FAVICON: "/communities/default/favicon.ico",
  APPLE_TOUCH_ICON: "/communities/default/apple-touch-icon.png",
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

export const COMMUNITY_LOCAL_CONFIGS = {
  "himeji-ymca": {
    COMMUNITY_ID: "himeji-ymca",
    FIREBASE_AUTH_TENANT_ID: "himeji-ymca-5pdjx",
    LIFF_ID: "2007838818-VR4yRvgL",
    LINE_CLIENT_ID: "2007838818",
  },
} as const;
