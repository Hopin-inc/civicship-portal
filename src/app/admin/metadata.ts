// app/admin/metadata.ts
import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "管理画面",
  description: "NEO四国88祭の管理者用ページです。",
  openGraph: {
    type: "website",
    title: "管理画面",
    description: "NEO四国88祭の管理者用ページです。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
