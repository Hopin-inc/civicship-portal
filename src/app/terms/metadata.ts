import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "NEO四国88祭 - 利用規約",
  description: "NEO四国88祭をご利用いただく際の規約をご案内します。",
  openGraph: {
    title: "NEO四国88祭 - 利用規約",
    description: "NEO四国88祭をご利用いただく際の規約をご案内します。",
    url: "https://www.neo88.app/terms",
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: "NEO四国88祭 - 利用規約",
    description: "NEO四国88祭をご利用いただく際の規約をご案内します。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: "https://www.neo88.app/terms",
  },
};
