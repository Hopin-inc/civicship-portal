// app/admin/metadata.ts
import { Metadata } from "next";
import { currentCommunityConfig, DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/communityMetadata";

export const metadata: Metadata = {
  title: `管理画面 | ${currentCommunityConfig.title}`,
  description: `${currentCommunityConfig.title}の管理者用ページです。`,
  openGraph: {
    type: "website",
    title: `管理画面 | ${currentCommunityConfig.title}`,
    description: `${currentCommunityConfig.title}の管理者用ページです。`,
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
