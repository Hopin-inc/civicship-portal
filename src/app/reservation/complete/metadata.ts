import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "申込完了",
  description: "お申し込みありがとうございます。参加を楽しみにお待ちください！",
  openGraph: {
    type: "website",
    title: "申込完了",
    description: "お申し込みありがとうございます。参加を楽しみにお待ちください！",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
