import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";

export async function generateMetadata(): Promise<Metadata> {
  const communityId = await getCommunityIdFromHeader();
  const config = communityId ? await getCommunityConfig(communityId) : null;

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
