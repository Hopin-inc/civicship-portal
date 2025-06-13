import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/communities/metadata";

export const metadata: Metadata = {
  title: `${currentCommunityConfig.title} - ログイン`,
  description: "ログインして、あなただけの" + currentCommunityConfig.title + "を。",
  openGraph: {
    title: `${currentCommunityConfig.title} - ログイン`,
    description: "ログインして、あなただけの" + currentCommunityConfig.title + "を。",
    url: `${currentCommunityConfig.domain}/login`,
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${currentCommunityConfig.title} - ログイン`,
    description: "ログインして、あなただけの" + currentCommunityConfig.title + "を。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: `${currentCommunityConfig.domain}/login`,
  },
};
