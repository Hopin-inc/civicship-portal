import { Metadata } from "next";

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

// コミュニティメタデータの取得関数
export async function getCommunityMetadata(communityId: string): Promise<CommunityMetadata> {
  return await fetchCommunityMetadata(communityId);
}

// コミュニティメタデータのフェッチ関数
async function fetchCommunityMetadata(communityId: string): Promise<CommunityMetadata> {
  try {
    // TODO: 実際のAPIエンドポイントやGraphQLクエリに置き換える
    // 現在は静的なマッピングを使用
    const metadata = COMMUNITY_METADATA_MAP[communityId] || DEFAULT_COMMUNITY_METADATA;
    return metadata;
  } catch (error) {
    console.error("Error fetching community metadata:", error);
    return DEFAULT_COMMUNITY_METADATA;
  }
}

// コミュニティIDとメタデータのマッピング
const COMMUNITY_METADATA_MAP: Record<string, CommunityMetadata> = {
  neo88: {
    title: "NEO四国88祭",
    description:
      "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。心が躍るさまざまな体験を通じて、新しい自分に出会う旅へ。地域の方々が用意する特別な体験がたくさん待っています。あなたのお気に入りを選んで、一期一会のオリジナルな旅を楽しんでみませんか？",
    icons: {
      icon: [
        { url: "/community/neo88/favicon.ico" },
        { url: "/community/neo88/favicon-16.png", type: "image/png", sizes: "16x16" },
        { url: "/community/neo88/favicon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/community/neo88/favicon-48.png", type: "image/png", sizes: "48x48" },
      ],
    },
    openGraph: {
      title: "NEO四国88祭",
      description:
        "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。",
      url: "https://www.neo88.app",
      siteName: "NEO四国88祭",
      images: [
        {
          url: "https://storage.googleapis.com/prod-civicship-storage-public/asset/neo88/ogp.jpg",
          width: 1200,
          height: 630,
          alt: "NEO四国88祭",
        },
      ],
      locale: "ja_JP",
      type: "website",
    },
    alternates: {
      canonical: "https://www.neo88.app",
    },
    logo: {
      url: "/community/neo88/logo.png",
      alt: "NEO四国88祭",
    },
    terms: {
      url: "/community/neo88/terms",
      title: "利用規約",
    },
  },
  // TODO: 他のコミュニティを追加
};

// デフォルトのコミュニティメタデータ（フォールバック用）
export const DEFAULT_COMMUNITY_METADATA: CommunityMetadata = {
  title: "Civicship Portal",
  description: "地域の特別な体験を発見しよう",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/images/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/images/favicon-48.png", type: "image/png", sizes: "48x48" },
    ],
  },
  openGraph: {
    title: "Civicship Portal",
    description: "地域の特別な体験を発見しよう",
    url: "https://portal.civicship.jp",
    siteName: "Civicship Portal",
    images: [
      {
        url: "https://storage.googleapis.com/prod-civicship-storage-public/asset/default/ogp.jpg",
        width: 1200,
        height: 630,
        alt: "Civicship Portal",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  alternates: {
    canonical: "https://portal.civicship.jp",
  },
  logo: {
    url: "/images/logo.png",
    alt: "Civicship Portal",
  },
  terms: {
    url: "/terms",
    title: "利用規約",
  },
};
