import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/communities/metadata";

export const metadata: Metadata = {
  title: `${currentCommunityConfig.title} - 新規登録`,
  description: `はじめての方はこちらから。${currentCommunityConfig.title}に加わってみませんか。`,
  openGraph: {
    title: `${currentCommunityConfig.title} - 新規登録`,
    description: `はじめての方はこちらから。${currentCommunityConfig.title}に加わってみませんか。`,
    url: `${currentCommunityConfig.domain}/sign-up`,
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${currentCommunityConfig.title} - 新規登録`,
    description: `はじめての方はこちらから。${currentCommunityConfig.title}に加わってみませんか。`,
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: `${currentCommunityConfig.domain}/sign-up`,
  },
};
