import { Metadata } from "next";

export const fallbackMetadata: Metadata = {
  title: "お探しのページは見つかりません",
  description: "この機会は存在しないか、削除された可能性があります。",
  openGraph: {
    title: "お探しのページは見つかりません",
    description: "この機会は存在しないか、削除された可能性があります。",
    images: [
      {
        url: "DEFAULT_OGP",
        width: 1200,
        height: 630,
        alt: "Not Found",
      },
    ],
  },
};
