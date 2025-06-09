import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/metadata/communityMetadata";

export const metadata: Metadata = {
  title: `${currentCommunityConfig.title} - 拠点一覧`,
  description: `どこで、誰と、どんな時間を過ごすか。${currentCommunityConfig.title}の体験が生まれる土地には、それぞれの風景と営みがあります。気になる場所に、出会ってみませんか。`,
  openGraph: {
    title: `${currentCommunityConfig.title} - 拠点一覧`,
    description:
      "体験が生まれる土地には、それぞれの風景と営みがあります。気になる場所に、出会ってみませんか。",
    url: `${currentCommunityConfig.domain}/places`,
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${currentCommunityConfig.title} - 拠点一覧`,
    description: "どこで、誰と、どんな時間を過ごすか。気になる場所に、出会ってみませんか。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: `${currentCommunityConfig.domain}/places`,
  },
};
