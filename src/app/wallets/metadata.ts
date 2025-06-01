import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "ウォレット",
  description: "ポイントの残高を確認したり、誰かにあげたりできます。",
  openGraph: {
    title: "ウォレット",
    description: "ポイントの残高を確認したり、誰かにあげたりできます。",
    url: "https://www.neo88.app/wallets",
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: "ウォレット",
    description: "ポイントの残高を確認したり、誰かにあげたりできます。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: "https://www.neo88.app/wallets",
  },
};
