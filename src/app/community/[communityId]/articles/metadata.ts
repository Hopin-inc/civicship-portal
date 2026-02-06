import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";

export async function generateMetadata(): Promise<Metadata> {
  const communityId = await getCommunityIdFromHeader();
  const config = communityId ? await getCommunityConfig(communityId) : null;

  const title = config?.title || "";
  const domain = config?.domain || "";
  const regionName = config?.regionName || "";
  const ogImages = getDefaultOgImage(config);

  return {
    title: `${title} - 記事一覧`,
    description: `${title}にまつわる人と地域の物語を集めました。言葉にふれるたび、${regionName}との距離が少しずつ近づいていくはずです。あなたも、物語に触れてみませんか。`,
    openGraph: {
      title: `${title} - 記事一覧`,
      description: `人と地域の物語を通して、${regionName}の魅力を伝えています。あなたも、読みながら旅をしてみませんか。`,
      url: `${domain}/articles`,
      type: "website",
      locale: "ja_JP",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - 記事一覧`,
      description: `${title}が届ける、人と地域の小さな物語。あなたの心にふれる一節を、見つけてみませんか。`,
      images: ogImages,
    },
    alternates: {
      canonical: `${domain}/articles`,
    },
  };
}
