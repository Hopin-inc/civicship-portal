import { Metadata } from "next";
import { DEFAULT_ASSET_PATHS } from "./constants";

export type FeaturesType =
  | "places"
  | "opportunities"
  | "points"
  | "tickets"
  | "articles"
  | "prefectures"
  | "credentials"
  | "justDaoIt"
  | "quests"
  | "languageSwitcher";

/**
 * コミュニティの規約・文書の定義
 */
export interface CommunityDocument {
  /** 文書のID（一意識別子） */
  id: string;

  /** 表示名 */
  title: string;

  /** ファイルパスまたはURL */
  path: string;

  /**
   * リンクタイプ
   * - 'external': 外部リンク（PDF等、新しいタブで開く）
   * - 'internal': 内部ページ（Next.js Link使用）
   */
  type: "external" | "internal";

  /**
   * 表示順序（小さい順に表示）
   * 指定しない場合は定義順
   */
  order?: number;
}

// コミュニティごとのベース設定
export interface CommunityBaseConfig {
  id: string;
  tokenName: string;
  title: string;
  description: string;
  shortDescription?: string;
  domain: string;
  faviconPrefix: string;
  logoPath: string;
  squareLogoPath: string;
  ogImagePath: string;
  enableFeatures: FeaturesType[];
  rootPath?: string;
  adminRootPath?: string;
  /** コミュニティ固有の規約・文書リスト */
  documents?: CommunityDocument[];
  /** 共通文書（利用規約・プライバシーポリシー）のオーバーライド */
  commonDocumentOverrides?: {
    terms?: CommunityDocument;
    privacy?: CommunityDocument;
  };
}

// コミュニティごとのメタデータ型定義
export interface CommunityMetadata {
  title: string;
  description: string;
  icons: Metadata["icons"];
  openGraph: Metadata["openGraph"];
  alternates?: Metadata["alternates"];
  logo: {
    url: string;
    alt: string;
  };
}

export function getCommunityIdFromEnv(): string {
  const communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;

  if (!communityId) {
    console.warn("COMMUNITY_ID environment variable is not set. Using default community settings.");
    return "default";
  }

  if (!COMMUNITY_BASE_CONFIG[communityId]) {
    console.warn(
      `COMMUNITY_ID "${communityId}" is not configured. Using default community settings.`,
    );
    return "default";
  }

  return communityId;
}

export const COMMUNITY_BASE_CONFIG: Record<string, CommunityBaseConfig> = {
  neo88: {
    id: "neo88",
    tokenName: "NEO88",
    title: "NEO四国88祭",
    description:
      "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。心が躍るさまざまな体験を通じて、新しい自分に出会う旅へ。地域の方々が用意する特別な体験がたくさん待っています。あなたのお気に入りを選んで、一期一会のオリジナルな旅を楽しんでみませんか？",
    shortDescription:
      "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。",
    domain: "https://www.neo88.app", // TODO: 環境によってドメインが変わるので、環境変数化する必要あり
    faviconPrefix: "/communities/neo88",
    logoPath: "/communities/neo88/logo.jpg",
    squareLogoPath: "/communities/neo88/logo-square.jpg",
    ogImagePath: "https://storage.googleapis.com/prod-civicship-storage-public/asset/neo88/ogp.jpg",
    enableFeatures: ["opportunities", "points", "articles", "tickets", "prefectures", "quests"],
    rootPath: "/opportunities",
    adminRootPath: "/admin/reservations",
  },
  "himeji-ymca": {
    id: "himeji-ymca",
    tokenName: "姫路YMCA",
    title: "姫路YMCA",
    description: "",
    shortDescription: "",
    domain: "https://himeji-ymca.civicship.jp", // TODO: 環境によってドメインが変わるので、環境変数化する必要あり
    faviconPrefix: "/communities/himeji-ymca",
    logoPath: "/communities/himeji-ymca/logo.jpg",
    squareLogoPath: "/communities/himeji-ymca/logo-square.jpg",
    ogImagePath:
      "https://storage.googleapis.com/prod-civicship-storage-public/asset/himeji-ymca/ogp.jpg",
    enableFeatures: ["points", "opportunities", "quests"],
    rootPath: "/users/me",
    adminRootPath: "/admin/wallet",
  },
  kibotcha: {
    id: "kibotcha",
    tokenName: "KIBOTCHA",
    title: "KIBOTCHA",
    description: "",
    shortDescription: "",
    domain: "https://kibotcha.civicship.jp", // TODO: 環境によってドメインが変わるので、環境変数化する必要あり
    faviconPrefix: "/communities/kibotcha",
    logoPath: "/communities/kibotcha/logo.jpg",
    squareLogoPath: "/communities/kibotcha/logo-square.jpg",
    ogImagePath:
      "https://storage.googleapis.com/prod-civicship-storage-public/asset/kibotcha/ogp.jpg",
    enableFeatures: ["points", "justDaoIt", "languageSwitcher"],
    rootPath: "/users/me",
    adminRootPath: "/admin/wallet",
    commonDocumentOverrides: {
      privacy: {
        id: "privacy",
        title: "users.promise.privacyPolicy",
        path: "/communities/kibotcha/privacy-policy.pdf",
        type: "external",
      },
      terms: {
        id: "terms",
        title: "users.promise.termsOfService",
        path: "/communities/kibotcha/terms.pdf",
        type: "external",
      },
    },
    documents: [
      {
        id: "bylaws",
        title: "users.documents.bylaws",
        path: "/communities/kibotcha/bylaws.pdf",
        type: "external",
        order: 1,
      },
      {
        id: "operating-regulations",
        title: "users.documents.operatingRegulations",
        path: "/communities/kibotcha/operating-regulations.pdf",
        type: "external",
        order: 2,
      },
      {
        id: "dao-meeting-rules",
        title: "users.documents.daoMeetingRules",
        path: "/communities/kibotcha/dao-meeting-rules.pdf",
        type: "external",
        order: 3,
      },
      {
        id: "token-regulations",
        title: "users.documents.tokenRegulations",
        path: "/communities/kibotcha/token-regulations.pdf",
        type: "external",
        order: 4,
      },
      {
        id: "whitepaper",
        title: "users.documents.whitepaper",
        path: "/communities/kibotcha/whitepaper.pdf",
        type: "external",
        order: 5,
      },
    ],
  },
  dais: {
    id: "dais",
    tokenName: "DAIS",
    title: "DAIS",
    description: "",
    shortDescription: "",
    domain: "https://dais.civicship.jp", // TODO: 環境によってドメインが変わるので、環境変数化する必要あり
    faviconPrefix: "/communities/dais",
    logoPath: "/communities/dais/logo.jpg",
    squareLogoPath: "/communities/dais/logo-square.jpg",
    ogImagePath: "https://storage.googleapis.com/prod-civicship-storage-public/asset/dais/ogp.jpg",
    enableFeatures: ["credentials"],
    rootPath: "/users/me",
    adminRootPath: "/admin/credentials",
  },
  kotohira: {
    id: "kotohira",
    tokenName: "KOTOHIRA",
    title: "琴平デジタル町民",
    description:
      "「観光地を訪れる」から「観光地と関わる」へ。あなたも琴平デジタル町民として、DAO型地域共創の一員になりませんか？",
    shortDescription: "「観光地を訪れる」から「観光地と関わる」へ。",
    domain: "https://kotohira.civicship.app", // TODO: 環境によってドメインが変わるので、環境変数化する必要あり
    faviconPrefix: "/communities/kotohira",
    logoPath: "/communities/kotohira/logo.jpg",
    squareLogoPath: "/communities/kotohira/logo-square.jpg",
    ogImagePath:
      "https://storage.googleapis.com/prod-civicship-storage-public/asset/kotohira/ogp.jpg",
    enableFeatures: ["opportunities", "points", "quests"],
    rootPath: "/opportunities",
    adminRootPath: "/admin/reservations",
  },
  izu: {
    id: "izu",
    tokenName: "IZU",
    title: "IZUとDAO",
    description:
      "クエストを通じて街に関わり、体験やお手伝いでポイントが貯まる。旅先で出会う人や場所とつながり、伊豆のまちをもっと深く楽しめるデジタル住民アプリです。",
    shortDescription: '観光を越えて、伊豆に "溶ける" デジタル住民アプリ',
    domain: "https://izu.civicship.app", // TODO: 環境によってドメインが変わるので、環境変数化する必要あり
    faviconPrefix: "/communities/izu",
    logoPath: "/communities/izu/logo.jpg",
    squareLogoPath: "/communities/izu/logo-square.jpg",
    ogImagePath: "https://storage.googleapis.com/prod-civicship-storage-public/asset/izu/ogp.png",
    enableFeatures: ["points", "justDaoIt", "languageSwitcher"],
    rootPath: "/users/me",
    adminRootPath: "/admin/wallet",
    commonDocumentOverrides: {
      privacy: {
        id: "privacy",
        title: "users.promise.privacyPolicy",
        path: "/communities/izu/{locale}/privacy-policy.pdf",
        type: "external",
      },
      terms: {
        id: "terms",
        title: "users.promise.termsOfService",
        path: "/communities/izu/{locale}/terms.pdf",
        type: "external",
      },
    },
    documents: [
      {
        id: "bylaws",
        title: "users.documents.bylaws",
        path: "/communities/izu/{locale}/bylaws.pdf",
        type: "external",
        order: 1,
      },
      {
        id: "operating-regulations",
        title: "users.documents.operatingRegulations",
        path: "/communities/izu/{locale}/operating-regulations.pdf",
        type: "external",
        order: 2,
      },
      {
        id: "dao-meeting-rules",
        title: "users.documents.daoMeetingRules",
        path: "/communities/izu/{locale}/dao-meeting-rules.pdf",
        type: "external",
        order: 3,
      },
      {
        id: "token-regulations",
        title: "users.documents.tokenRegulations",
        path: "/communities/izu/{locale}/token-regulations.pdf",
        type: "external",
        order: 4,
      },
      {
        id: "whitepaper",
        title: "users.documents.whitepaper",
        path: "/communities/izu/{locale}/whitepaper.pdf",
        type: "external",
        order: 5,
      },
    ],
  },
  default: {
    id: "default",
    tokenName: "NEO88",
    title: "NEO四国88祭",
    description:
      "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。心が躍るさまざまな体験を通じて、新しい自分に出会う旅へ。地域の方々が用意する特別な体験がたくさん待っています。あなたのお気に入りを選んで、一期一会のオリジナルな旅を楽しんでみませんか？",
    shortDescription:
      "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。",
    domain: "https://www.neo88.app", // TODO: 環境によってドメインが変わるので、環境変数化する必要あり
    faviconPrefix: "/communities/neo88",
    logoPath: "/communities/neo88/logo.jpg",
    squareLogoPath: "/communities/neo88/logo-square.jpg",
    ogImagePath: "https://storage.googleapis.com/prod-civicship-storage-public/asset/neo88/ogp.jpg",
    enableFeatures: [
      "opportunities",
      "places",
      "points",
      "articles",
      "tickets",
      "prefectures",
      "quests",
    ],
    rootPath: "/opportunities",
  },
};

export const COMMUNITY_ID = getCommunityIdFromEnv();

export function getCurrentRegionName(): string {
  if (COMMUNITY_ID === "neo88") return "四国";
  if (COMMUNITY_ID === "kibotcha") return "東松島";
  if (COMMUNITY_ID === "dais") return "四国";
  return "地域";
}

export function getCurrentRegionKey(): string {
  if (COMMUNITY_ID === "neo88") return "common.regions.shikoku";
  if (COMMUNITY_ID === "kibotcha") return "common.regions.higashimatsushima";
  if (COMMUNITY_ID === "dais") return "common.regions.shikoku";
  return "common.regions.default";
}

// 現在のコミュニティの設定
export const currentCommunityConfig = COMMUNITY_BASE_CONFIG[COMMUNITY_ID];

// デフォルトのOGP画像
export const DEFAULT_OPEN_GRAPH_IMAGE = [
  {
    url: currentCommunityConfig.ogImagePath,
    width: 1200,
    height: 630,
    alt: currentCommunityConfig.title,
  },
];

// ロゴのパスを取得
export function getLogoPath(): string {
  return currentCommunityConfig.logoPath ?? DEFAULT_ASSET_PATHS.LOGO;
}

// 正方形ロゴのパスを取得
export function getSquareLogoPath(): string {
  return currentCommunityConfig.squareLogoPath ?? DEFAULT_ASSET_PATHS.SQUARE_LOGO;
}

// コミュニティのメタデータを生成
function generateCommunityMetadata(communityId: string): CommunityMetadata {
  const baseConfig = COMMUNITY_BASE_CONFIG[communityId] || COMMUNITY_BASE_CONFIG.default;

  return {
    title: baseConfig.title,
    description: baseConfig.description,
    icons: {
      icon: [
        {
          url: baseConfig.faviconPrefix
            ? `${baseConfig.faviconPrefix}/favicon.ico`
            : DEFAULT_ASSET_PATHS.FAVICON,
        },
      ],
      apple: [
        {
          url: baseConfig.faviconPrefix
            ? `${baseConfig.faviconPrefix}/apple-touch-icon.png`
            : DEFAULT_ASSET_PATHS.APPLE_TOUCH_ICON,
        },
      ],
    },
    openGraph: {
      title: baseConfig.title,
      description: baseConfig.description,
      url: baseConfig.domain,
      siteName: baseConfig.title,
      locale: "ja_JP",
      type: "website",
      images: [
        {
          url: baseConfig.ogImagePath,
          width: 1200,
          height: 630,
          alt: baseConfig.title,
        },
      ],
    },
    alternates: {
      canonical: baseConfig.domain,
    },
    logo: {
      url: baseConfig.logoPath ?? DEFAULT_ASSET_PATHS.LOGO,
      alt: baseConfig.title,
    },
  };
}

// 現在のコミュニティのメタデータ
export const currentCommunityMetadata = generateCommunityMetadata(COMMUNITY_ID);

export const fallbackMetadata: Metadata = {
  title: "お探しのページは見つかりません",
  description: "この機会は存在しないか、削除された可能性があります。",
  openGraph: {
    title: "お探しのページは見つかりません",
    description: "この機会は存在しないか、削除された可能性があります。",
    images: [
      {
        url: "DEFAULT_OGP",
        width: 1200,
        height: 630,
        alt: "Not Found",
      },
    ],
  },
};

export const getCommunityMetadata = (communityId: string): CommunityMetadata => {
  return generateCommunityMetadata(communityId);
};
