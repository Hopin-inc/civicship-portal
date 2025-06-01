import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "検索結果",
  description: "検索条件に合致する募集一覧を表示します。",
  openGraph: {
    type: "website",
    title: "検索結果",
    description: "興味のある募集を見つけて、参加しましょう。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
