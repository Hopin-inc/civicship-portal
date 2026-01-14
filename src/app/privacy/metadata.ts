import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/communities/metadata";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${currentCommunityConfig.title} - プライバシーポリシー`,
  description: "個人情報の取り扱いについてご確認いただけます。",
  openGraph: {
    title: `${currentCommunityConfig.title} - プライバシーポリシー`,
    description: "個人情報の取り扱い方針についてご確認いただけます。",
    url: `${currentCommunityConfig.domain}/privacy`,
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${currentCommunityConfig.title} - プライバシーポリシー`,
    description: "個人情報の取り扱い方針についてご確認いただけます。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: `${currentCommunityConfig.domain}/privacy`,
  },
};
