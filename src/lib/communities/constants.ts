export const DEFAULT_ASSET_PATHS = {
  LOGO: "/communities/default/logo.jpg",
  SQUARE_LOGO: "/communities/default/logo-square.jpg",
  FAVICON: "/communities/default/favicon.ico",
  APPLE_TOUCH_ICON: "/communities/default/apple-touch-icon.png",
} as const;

export const COMMUNITY_CONFIGS = {
  neo88: {
    COMMUNITY_ID: "neo88",
    FIREBASE_AUTH_TENANT_ID: "neo88-5qtpy",
    LIFF_ID: "2007251473-yJNnzapO",
    LINE_CLIENT_ID: "2007251473",
  },
  kibotcha: {
    COMMUNITY_ID: "kibotcha",
    FIREBASE_AUTH_TENANT_ID: "kibotcha-sff2c",
    LIFF_ID: "2007594502-amjOlNlxs",
    LINE_CLIENT_ID: "2007594502",
  },
  dais: {
    COMMUNITY_ID: "dais",
    FIREBASE_AUTH_TENANT_ID: "neo88-5qtpy", // neo88と同じ
    LIFF_ID: "2007251473-yJNnzapO", // neo88と同じ
    LINE_CLIENT_ID: "2007251473", // neo88と同じ
  },
} as const;

export type CommunityId = keyof typeof COMMUNITY_CONFIGS;
