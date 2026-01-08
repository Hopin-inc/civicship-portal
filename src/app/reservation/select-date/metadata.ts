import { Metadata } from "next";
import { getCommunityConfigFromEnv, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getCommunityConfigFromEnv();
  
  const title = config?.title || "";
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: `申し込む日付を選ぶ | ${title}`,
    description: "参加を申し込む日付を選択しましょう。",
    openGraph: {
      type: "website",
      title: `申し込む日付を選ぶ | ${title}`,
      description: "参加を申し込む日付を選択しましょう。",
      images: ogImages,
    },
  };
}
