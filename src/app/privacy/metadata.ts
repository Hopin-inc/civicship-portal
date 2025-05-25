import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEO四国88祭 - プライバシーポリシー",
  description: "個人情報の取り扱いについてご確認いただけます。",
  openGraph: {
    title: "NEO四国88祭 - プライバシーポリシー",
    description: "個人情報の取り扱い方針についてご確認いただけます。",
    url: "https://www.neo88.app/privacy",
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: "NEO四国88祭 - プライバシーポリシー",
    description: "個人情報の取り扱い方針についてご確認いただけます。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: "https://www.neo88.app/privacy",
  },
};
