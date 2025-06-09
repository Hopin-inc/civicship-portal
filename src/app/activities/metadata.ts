import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/metadata/communityMetadata";

export const metadata: Metadata = {
  title: `${currentCommunityConfig.title} - 募集一覧`,
  description:
    "体験が始まるその一歩は、ここから。文化と自然、人のあたたかさにふれる募集がそろいました。気になる体験を見つけて、あなただけの時間を過ごしてみませんか。",
  openGraph: {
    title: `${currentCommunityConfig.title} - 募集一覧`,
    description:
      "体験が始まるその一歩は、ここから。文化と自然、人のあたたかさにふれる募集がそろいました。気になる体験を見つけて、あなただけの時間を過ごしてみませんか。",
    url: `${currentCommunityConfig.domain}/activities`,
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${currentCommunityConfig.title} - 募集一覧`,
    description:
      "文化と自然、人のあたたかさにふれる募集がそろいました。気になる体験を探してみませんか。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: `${currentCommunityConfig.domain}/activities`,
  },
};
