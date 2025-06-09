import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/metadata/communityMetadata";

export const metadata: Metadata = {
  title: `${currentCommunityConfig.title} - 利用規約`,
  description: `${currentCommunityConfig.title}をご利用いただく際の規約をご案内します。`,
  openGraph: {
    title: `${currentCommunityConfig.title} - 利用規約`,
    description: `${currentCommunityConfig.title}をご利用いただく際の規約をご案内します。`,
    url: `${currentCommunityConfig.domain}/terms`,
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${currentCommunityConfig.title} - 利用規約`,
    description: `${currentCommunityConfig.title}をご利用いただく際の規約をご案内します。`,
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: `${currentCommunityConfig.domain}/terms`,
  },
};
