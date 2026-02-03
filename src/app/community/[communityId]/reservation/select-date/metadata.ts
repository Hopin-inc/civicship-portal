import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";

export async function generateMetadata(): Promise<Metadata> {
  const communityId = await getCommunityIdFromHeader();
  const config = communityId ? await getCommunityConfig(communityId) : null;

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
