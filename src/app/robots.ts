import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isStaging = process.env.ENV === "staging";
  const isProduction = process.env.NODE_ENV === "production" && !isStaging;

  if (!isProduction) {
    // 非本番環境: すべての検索エンジンをブロック
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // 本番環境: すべてを許可（標準的な記法）
  return {
    rules: {
      userAgent: "*",
      disallow: "",
    },
  };
}
