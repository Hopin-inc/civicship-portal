import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata({ params }: { params: Promise<{ communityId: string }> }): Promise<Metadata> {
  const { communityId } = await params;
  const config = await getCommunityConfig(communityId);
  
  const title = config?.title || "";
  const domain = config?.domain || "";
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: `${title} - 拠点一覧`,
    description: `どこで、誰と、どんな時間を過ごすか。${title}の体験が生まれる土地には、それぞれの風景と営みがあります。気になる場所に、出会ってみませんか。`,
    openGraph: {
      title: `${title} - 拠点一覧`,
      description:
        "体験が生まれる土地には、それぞれの風景と営みがあります。気になる場所に、出会ってみませんか。",
      url: `${domain}/places`,
      type: "website",
      locale: "ja_JP",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - 拠点一覧`,
      description: "どこで、誰と、どんな時間を過ごすか。気になる場所に、出会ってみませんか。",
      images: ogImages,
    },
    alternates: {
      canonical: `${domain}/places`,
    },
  };
}
