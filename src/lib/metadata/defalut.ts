import { Metadata } from "next";
import { COMMUNITY_ID } from "@/utils";
import { getCommunityAssets } from "@/lib/community/assetService";

const getCommunityName = (): string => {
  const communityNames: Record<string, string> = {
    "neo88": "NEO四国88祭"
  };
  
  return communityNames[COMMUNITY_ID] || COMMUNITY_ID;
};

const DEFAULT_TITLE = getCommunityName();
const communityAssets = getCommunityAssets();
const DEFAULT_DESCRIPTION =
  "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。心が躍るさまざまな体験を通じて、新しい自分に出会う旅へ。地域の方々が用意する特別な体験がたくさん待っています。あなたのお気に入りを選んで、一期一会のオリジナルな旅を楽しんでみませんか？";

const DEFAULT_ICONS: Metadata["icons"] = {
  icon: [
    { url: communityAssets.favicon },
    { url: "/images/favicon-16.png", type: "image/png", sizes: "16x16" },
    { url: "/images/favicon-32.png", type: "image/png", sizes: "32x32" },
    { url: "/images/favicon-48.png", type: "image/png", sizes: "48x48" },
  ],
};

const DEFAULT_OPEN_GRAPH_IMAGE = [
  {
    url: communityAssets.ogImage,
    width: 1200,
    height: 630,
    alt: DEFAULT_TITLE,
  },
];

const DEFAULT_OPEN_GRAPH: Metadata["openGraph"] = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  url: "https://www.neo88.app",
  siteName: DEFAULT_TITLE,
  images: DEFAULT_OPEN_GRAPH_IMAGE,
  locale: "ja_JP",
  type: "website",
};

export {
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_ICONS,
  DEFAULT_OPEN_GRAPH_IMAGE,
  DEFAULT_OPEN_GRAPH,
};
