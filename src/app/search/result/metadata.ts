import { Metadata } from "next";
import { getCommunityConfigFromEnv, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCommunityConfigFromEnv();
  
  const title = config?.title || "";
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: `検索結果 | ${title}`,
    description: "検索条件に合致する募集一覧を表示します。",
    openGraph: {
      type: "website",
      title: `検索結果 | ${title}`,
      description: "興味のある募集を見つけて、参加しましょう。",
      images: ogImages,
    },
  };
}
