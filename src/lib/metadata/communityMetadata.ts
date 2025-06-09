import { Metadata } from "next";

// コミュニティごとのベース設定
interface CommunityBaseConfig {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  domain: string;
  faviconPrefix: string;
  logoPath: string;
  squareLogoPath: string;
  ogImagePath: string;
}

// コミュニティごとのメタデータ型定義
export interface CommunityMetadata {
  title: string;
  description: string;
  icons: Metadata["icons"];
  openGraph: Metadata["openGraph"];
  alternates?: Metadata["alternates"];
  terms?: {
    url: string;
    title: string;
  };
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

const COMMUNITY_BASE_CONFIG: Record<string, CommunityBaseConfig> = {
  neo88: {
    id: "neo88",
    title: "NEO四国88祭",
    description:
      "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。心が躍るさまざまな体験を通じて、新しい自分に出会う旅へ。地域の方々が用意する特別な体験がたくさん待っています。あなたのお気に入りを選んで、一期一会のオリジナルな旅を楽しんでみませんか？",
    shortDescription:
      "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。",
    domain: "https://www.neo88.app",
    faviconPrefix: "/communities/neo88",
    logoPath: "/communities/neo88/logo.jpg",
    squareLogoPath: "/communities/neo88/logo-square.jpg",
    ogImagePath: "https://storage.googleapis.com/prod-civicship-storage-public/asset/neo88/ogp.jpg",
  },
  default: {
    id: "default",
    title: "NEO四国88祭",
    description:
      "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。心が躍るさまざまな体験を通じて、新しい自分に出会う旅へ。地域の方々が用意する特別な体験がたくさん待っています。あなたのお気に入りを選んで、一期一会のオリジナルな旅を楽しんでみませんか？",
    shortDescription:
      "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。",
    domain: "https://www.neo88.app",
    faviconPrefix: "/communities/neo88",
    logoPath: "/communities/neo88/logo.jpg",
    squareLogoPath: "/communities/neo88/logo-square.jpg",
    ogImagePath: "https://storage.googleapis.com/prod-civicship-storage-public/asset/neo88/ogp.jpg",
  },
};

// コミュニティメタデータの取得関数
export async function getCommunityMetadata(communityId?: string): Promise<CommunityMetadata> {
  const targetCommunityId = communityId || getCommunityIdFromEnv();
  return await fetchCommunityMetadata(targetCommunityId);
}

// コミュニティメタデータのフェッチ関数
async function fetchCommunityMetadata(communityId: string): Promise<CommunityMetadata> {
  try {
    // TODO: 実際のAPIエンドポイントやGraphQLクエリに置き換える
    // 現在は静的なマッピングを使用
    return generateCommunityMetadata(communityId);
  } catch (error) {
    console.error("Error fetching community metadata:", error);
    return generateDefaultMetadata();
  }
}

// コミュニティメタデータの生成
function generateCommunityMetadata(communityId: string): CommunityMetadata {
  const baseConfig = COMMUNITY_BASE_CONFIG[communityId];

  if (!baseConfig) {
    return generateDefaultMetadata();
  }

  return {
    title: baseConfig.title,
    description: baseConfig.description,
    icons: {
      icon: [
        { url: `${baseConfig.faviconPrefix}/favicon.ico` },
        { url: `${baseConfig.faviconPrefix}/favicon-16.png`, type: "image/png", sizes: "16x16" },
        { url: `${baseConfig.faviconPrefix}/favicon-32.png`, type: "image/png", sizes: "32x32" },
        { url: `${baseConfig.faviconPrefix}/favicon-48.png`, type: "image/png", sizes: "48x48" },
      ],
    },
    openGraph: {
      title: baseConfig.title,
      description: baseConfig.shortDescription || baseConfig.description,
      url: baseConfig.domain,
      siteName: baseConfig.title,
      images: [
        {
          url: baseConfig.ogImagePath,
          width: 1200,
          height: 630,
          alt: baseConfig.title,
        },
      ],
      locale: "ja_JP",
      type: "website",
    },
    alternates: {
      canonical: baseConfig.domain,
    },
    logo: {
      url: baseConfig.logoPath,
      alt: baseConfig.title,
    },
    terms: {
      url: "/terms",
      title: "利用規約",
    },
  };
}

// デフォルトのコミュニティメタデータ生成関数
function generateDefaultMetadata(): CommunityMetadata {
  return generateCommunityMetadata("default");
}

// エクスポート用の定数
export const DEFAULT_COMMUNITY_METADATA = generateDefaultMetadata();

// 現在のコミュニティID取得
const currentCommunityId = getCommunityIdFromEnv();

// 現在のコミュニティ設定を取得（エクスポート用）
export const currentCommunityConfig =
  COMMUNITY_BASE_CONFIG[currentCommunityId] || COMMUNITY_BASE_CONFIG.default;

export const DEFAULT_OPEN_GRAPH_IMAGE = [
  {
    url: currentCommunityConfig.ogImagePath,
    width: 1200,
    height: 630,
    alt: currentCommunityConfig.title,
  },
];

export const DEFAULT_OPEN_GRAPH: Metadata["openGraph"] = {
  title: currentCommunityConfig.title,
  description: currentCommunityConfig.description,
  url: currentCommunityConfig.domain,
  siteName: currentCommunityConfig.title,
  images: DEFAULT_OPEN_GRAPH_IMAGE,
  locale: "ja_JP",
  type: "website",
};
