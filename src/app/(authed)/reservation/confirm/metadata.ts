import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/communities/metadata";

export const metadata: Metadata = {
  title: `申込内容の確認 | ${currentCommunityConfig.title}`,
  description: "申込内容をご確認ください。",
  openGraph: {
    type: "website",
    title: `申込内容の確認 | ${currentCommunityConfig.title}`,
    description: "申込内容をご確認ください。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
