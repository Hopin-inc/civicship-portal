import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "NEO四国88祭 - 新規登録",
  description: "はじめての方はこちらから。NEO四国88祭に加わってみませんか。",
  openGraph: {
    title: "NEO四国88祭 - 新規登録",
    description: "はじめての方はこちらから。NEO四国88祭に加わってみませんか。",
    url: "https://www.neo88.app/sign-up",
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: "NEO四国88祭 - 新規登録",
    description: "はじめての方はこちらから。NEO四国88祭に加わってみませんか。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: "https://www.neo88.app/sign-up",
  },
};
