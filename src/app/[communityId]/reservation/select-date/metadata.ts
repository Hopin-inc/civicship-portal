import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata({ params }: { params: Promise<{ communityId: string }> }): Promise<Metadata> {
  const { communityId } = await params;
  const config = await getCommunityConfig(communityId);
  
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
