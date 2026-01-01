import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    // 非本番環境: すべての検索エンジンをブロック
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // 本番環境: すべてを許可
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
