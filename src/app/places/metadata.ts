import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "NEO四国88祭 - 拠点一覧",
  description:
    "どこで、誰と、どんな時間を過ごすか。NEO四国88祭の体験が生まれる土地には、それぞれの風景と営みがあります。気になる場所に、出会ってみませんか。",
  openGraph: {
    title: "NEO四国88祭 - 拠点一覧",
    description:
      "体験が生まれる土地には、それぞれの風景と営みがあります。気になる場所に、出会ってみませんか。",
    url: "https://www.neo88.app/places",
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: "NEO四国88祭 - 拠点一覧",
    description: "どこで、誰と、どんな時間を過ごすか。気になる場所に、出会ってみませんか。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: "https://www.neo88.app/places",
  },
};
