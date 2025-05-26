import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "NEO四国88祭 - ログイン",
  description: "ログインして、あなただけのNEO四国88祭を。",
  openGraph: {
    title: "NEO四国88祭 - ログイン",
    description: "ログインして、あなただけのNEO四国88祭を。",
    url: "https://www.neo88.app/login",
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: "NEO四国88祭 - ログイン",
    description: "ログインして、あなただけのNEO四国88祭を。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: "https://www.neo88.app/login",
  },
};
