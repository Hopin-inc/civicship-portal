import { Metadata } from "next";
import { currentCommunityConfig, DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";

export const metadata: Metadata = {
  title: `申し込む日付を選ぶ | ${currentCommunityConfig.title}`,
  description: "参加を申し込む日付を選択しましょう。",
  openGraph: {
    type: "website",
    title: `申し込む日付を選ぶ | ${currentCommunityConfig.title}`,
    description: "参加を申し込む日付を選択しましょう。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
