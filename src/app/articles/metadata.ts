import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "記事一覧",
  description:
    "NEO四国88祭にまつわる人と地域の物語を集めました。言葉にふれるたび、四国との距離が少しずつ近づいていくはずです。あなたも、物語に触れてみませんか。",
  openGraph: {
    title: "記事一覧",
    description:
      "人と地域の物語を通して、四国の魅力を伝えています。あなたも、読みながら旅をしてみませんか。",
    url: "https://www.neo88.app/articles",
    type: "website",
    locale: "ja_JP",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  twitter: {
    card: "summary_large_image",
    title: "記事一覧",
    description:
      "NEO四国88祭が届ける、人と地域の小さな物語。あなたの心にふれる一節を、見つけてみませんか。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
  alternates: {
    canonical: "https://www.neo88.app/articles",
  },
};
