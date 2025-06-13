import { Metadata } from "next";
import { currentCommunityConfig, DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";

export const metadata: Metadata = {
  title: `マイページ | ${currentCommunityConfig.title}`,
  description: "参加履歴やプロフィールを、あなただけの視点で見返せるページです。",
  openGraph: {
    type: "website",
    title: `マイページ | ${currentCommunityConfig.title}`,
    description:
      "あなただけの記録が詰まったページ。参加の軌跡やプロフィール情報を振り返ってみましょう。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
