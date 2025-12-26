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
    title: `申込内容の確認 | ${title}`,
    description: "申込内容をご確認ください。",
    openGraph: {
      type: "website",
      title: `申込内容の確認 | ${title}`,
      description: "申込内容をご確認ください。",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}
