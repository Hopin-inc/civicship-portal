import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { getCommunityConfig } from "@/lib/graphql/getCommunityConfig";
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
    title: `検索結果 | ${title}`,
    description: "検索条件に合致する募集一覧を表示します。",
    openGraph: {
      type: "website",
      title: `検索結果 | ${title}`,
      description: "興味のある募集を見つけて、参加しましょう。",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}
