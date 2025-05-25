import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/metadata/defalut";

export const metadata: Metadata = {
  title: "申込内容の確認 | NEO四国88祭",
  description: "選択した募集をご確認のうえ、お申し込みください。",
  openGraph: {
    type: "website",
    title: "申込内容の確認 | NEO四国88祭",
    description: "選択した募集をご確認のうえ、お申し込みください。",
    images: DEFAULT_OPEN_GRAPH_IMAGE,
  },
};
