import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/communities/metadata";

export const metadata: Metadata = {
  title: `${currentCommunityConfig.title} - 記事一覧`,
  description: `${currentCommunityConfig.title}にまつわる人と地域の物語を集めました。言葉にふれるたび、四国との距離が少しずつ近づいていくはずです。あなたも、物語に触れてみませんか。`,
  openGraph: {
    title: `${currentCommunityConfig.title} - 記事一覧`,
    description:
      "人と地域の物語を通して、四国の魅力を伝えています。あなたも、読みながら旅をしてみませんか。",
    url: `${currentCommunityConfig.domain}/articles`,
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${currentCommunityConfig.title} - 記事一覧`,
    description: `${currentCommunityConfig.title}が届ける、人と地域の小さな物語。あなたの心にふれる一節を、見つけてみませんか。`,
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: `${currentCommunityConfig.domain}/articles`,
  },
};
