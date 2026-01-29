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
    LIFF_ID: "2007251473-z8B97aQb",
    LINE_CLIENT_ID: "2007251473",
  },
  kibotcha: {
    COMMUNITY_ID: "kibotcha",
    FIREBASE_AUTH_TENANT_ID: "kibotcha-sff2c",
    LIFF_ID: "2007594502-XLgqPjP7",
    LINE_CLIENT_ID: "2007594502",
  },
  dais: {
    COMMUNITY_ID: "dais",
    FIREBASE_AUTH_TENANT_ID: "dais-hpvht",
    LIFF_ID: "2007726826-Xq2yG2ow",
    LINE_CLIENT_ID: "2007726826",
  },
  kotohira: {
    COMMUNITY_ID: "kotohira",
    FIREBASE_AUTH_TENANT_ID: "kotohira-cemsv",
    LIFF_ID: "2007726826-Xq2yG2ow",
    LINE_CLIENT_ID: "2007726826",
  },
  "himeji-ymca": {
    COMMUNITY_ID: "himeji-ymca",
    FIREBASE_AUTH_TENANT_ID: "himeji-ymca-5pdjx",
    LIFF_ID: "2007838818-DmvQX2eN",
    LINE_CLIENT_ID: "2007838818",
  },
  "izu-dao": {
    COMMUNITY_ID: "izu",
    FIREBASE_AUTH_TENANT_ID: "izu-dao-s5ok1",
    LIFF_ID: "2008325789-XlD6wNkZ",
    LINE_CLIENT_ID: "2008325789",
  },
  ubuyama: {
    COMMUNITY_ID: "ubuyama",
    FIREBASE_AUTH_TENANT_ID: "ubuyama-ruvmf",
    LIFF_ID: "2008931473-AuXq5Hr2",
    LINE_CLIENT_ID: "2008931473",
  },
} as const;

export type CommunityId = keyof typeof COMMUNITY_CONFIGS;
