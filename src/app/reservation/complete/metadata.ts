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
    title: `申込完了 | ${title}`,
    description: "お申し込みありがとうございます。参加を楽しみにお待ちください！",
    openGraph: {
      type: "website",
      title: `申込完了 | ${title}`,
      description: "お申し込みありがとうございます。参加を楽しみにお待ちください！",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}
