import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";

export async function generateMetadata(): Promise<Metadata> {
  const communityId = await getCommunityIdFromHeader();
  const config = communityId ? await getCommunityConfig(communityId) : null;

  const title = config?.title || "";
  const ogImages = getDefaultOgImage(config);

  return {
    title: `申込完了 | ${title}`,
    description: "お申し込みありがとうございます。参加を楽しみにお待ちください！",
    openGraph: {
      type: "website",
      title: `申込完了 | ${title}`,
      description: "お申し込みありがとうございます。参加を楽しみにお待ちください！",
      images: ogImages,
    },
  };
}
