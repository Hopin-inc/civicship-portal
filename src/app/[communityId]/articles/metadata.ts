import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";

export async function generateMetadata({ params }: { params: Promise<{ communityId: string }> }): Promise<Metadata> {
  const { communityId } = await params;
  const config = await getCommunityConfig(communityId);
  
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
