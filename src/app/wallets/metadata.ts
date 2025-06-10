import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/communities/metadata";

export const metadata: Metadata = {
  title: `${currentCommunityConfig.title} - ウォレット`,
  description: "ポイントの残高を確認したり、誰かにあげたりできます。",
  openGraph: {
    title: `${currentCommunityConfig.title} - ウォレット`,
    description: "ポイントの残高を確認したり、誰かにあげたりできます。",
    url: `${currentCommunityConfig.domain}/wallets`,
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${currentCommunityConfig.title} - ウォレット`,
    description: "ポイントの残高を確認したり、誰かにあげたりできます。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: `${currentCommunityConfig.domain}/wallets`,
  },
};
