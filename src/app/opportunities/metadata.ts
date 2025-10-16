import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/communities/metadata";

const fallbackDescription = "体験が始まるその一歩は、ここから。文化と自然、人のあたたかさにふれる募集がそろいました。気になる体験を見つけて、あなただけの時間を過ごしてみませんか。";
const fallbackShortDescription = "文化と自然、人のあたたかさにふれる募集がそろいました。気になる体験を探してみませんか。";

const description = currentCommunityConfig.description || fallbackDescription;
const shortDescription = currentCommunityConfig.shortDescription || fallbackShortDescription;

export const metadata: Metadata = {
  title: `${currentCommunityConfig.title} - 募集一覧`,
  description: description,
  openGraph: {
    title: `${currentCommunityConfig.title} - 募集一覧`,
    description: description,
    url: `${currentCommunityConfig.domain}/activities`,
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${currentCommunityConfig.title} - 募集一覧`,
    description: shortDescription,
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: `${currentCommunityConfig.domain}/activities`,
  },
};
