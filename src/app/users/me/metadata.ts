import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "マイページ | NEO四国88祭",
  description: "参加履歴やプロフィールを、あなただけの視点で見返せるページです。",
  openGraph: {
    type: "website",
    title: "マイページ | NEO四国88祭",
    description:
      "あなただけの記録が詰まったページ。参加の軌跡やプロフィール情報を振り返ってみましょう。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
