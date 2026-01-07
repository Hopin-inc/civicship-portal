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
  
  return {
    title: `申し込む日付を選ぶ | ${title}`,
    description: "参加を申し込む日付を選択しましょう。",
    openGraph: {
      type: "website",
      title: `申し込む日付を選ぶ | ${title}`,
      description: "参加を申し込む日付を選択しましょう。",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}
