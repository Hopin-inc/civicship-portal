import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata({ params }: { params: Promise<{ communityId: string }> }): Promise<Metadata> {
  const { communityId } = await params; const config = await getCommunityConfig(communityId);
  
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
