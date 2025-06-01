import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "募集を探す",
  description: "興味のある募集をキーワードや日付で検索しましょう。",
  openGraph: {
    type: "website",
    title: "募集を探す",
    description: "あなたにぴったりの体験を見つけて、参加への一歩を踏み出そう。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
