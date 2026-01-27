import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata({ params }: { params: Promise<{ communityId: string }> }): Promise<Metadata> {
  const { communityId } = await params;
  const config = await getCommunityConfig(communityId);
  
  const title = config?.title || "";
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: `申込内容の確認 | ${title}`,
    description: "申込内容をご確認ください。",
    openGraph: {
      type: "website",
      title: `申込内容の確認 | ${title}`,
      description: "申込内容をご確認ください。",
      images: ogImages,
    },
  };
}
