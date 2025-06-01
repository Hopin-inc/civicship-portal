import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "チケット",
  description: "これからの体験で使えるチケットを、こちらで確認できます。",
  openGraph: {
    title: "チケット",
    description: "これからの体験で使えるチケットを、こちらで確認できます。",
    url: "https://www.neo88.app/tickets",
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: "チケット",
    description: "これからの体験で使えるチケットを、こちらで確認できます。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: "https://www.neo88.app/tickets",
  },
};
