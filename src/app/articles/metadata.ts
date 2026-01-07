import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { getCommunityConfig } from "@/lib/communities/getCommunityConfig";
import { headers, cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  // Fetch community config from database
  const communityConfig = await getCommunityConfig(communityId);
  const title = communityConfig?.title || "";
  const regionName = communityConfig?.regionName || "";
  
  return {
    title: `${title} - 記事一覧`,
    description: `${title}にまつわる人と地域の物語を集めました。言葉にふれるたび、${regionName}との距離が少しずつ近づいていくはずです。あなたも、物語に触れてみませんか。`,
    openGraph: {
      title: `${title} - 記事一覧`,
      description: `人と地域の物語を通して、${regionName}の魅力を伝えています。あなたも、読みながら旅をしてみませんか。`,
      url: `${communityConfig?.domain || ""}/articles`,
      type: "website",
      locale: "ja_JP",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - 記事一覧`,
      description: `${title}が届ける、人と地域の小さな物語。あなたの心にふれる一節を、見つけてみませんか。`,
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    alternates: {
      canonical: `${communityConfig?.domain || ""}/articles`,
    },
  };
}
