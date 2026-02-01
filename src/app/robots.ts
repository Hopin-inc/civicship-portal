import { MetadataRoute } from "next";
import { isProduction } from "@/lib/environment";

export default function robots(): MetadataRoute.Robots {

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
