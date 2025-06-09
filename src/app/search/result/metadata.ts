import { Metadata } from "next";
import { currentCommunityConfig, DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/communityMetadata";

export const metadata: Metadata = {
  title: `検索結果 | ${currentCommunityConfig.title}`,
  description: "検索条件に合致する募集一覧を表示します。",
  openGraph: {
    type: "website",
    title: `検索結果 | ${currentCommunityConfig.title}`,
    description: "興味のある募集を見つけて、参加しましょう。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
