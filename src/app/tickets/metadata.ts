import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/communities/metadata";

export const metadata: Metadata = {
  title: `${currentCommunityConfig.title} - チケット`,
  description: "これからの体験で使えるチケットを、こちらで確認できます。",
  openGraph: {
    title: `${currentCommunityConfig.title} - チケット`,
    description: "これからの体験で使えるチケットを、こちらで確認できます。",
    url: `${currentCommunityConfig.domain}/tickets`,
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${currentCommunityConfig.title} - チケット`,
    description: "これからの体験で使えるチケットを、こちらで確認できます。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: `${currentCommunityConfig.domain}/tickets`,
  },
};
