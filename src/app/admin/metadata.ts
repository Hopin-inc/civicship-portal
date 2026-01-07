// app/admin/metadata.ts
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
    title: `管理画面 | ${title}`,
    description: `${title}の管理者用ページです。`,
    openGraph: {
      type: "website",
      title: `管理画面 | ${title}`,
      description: `${title}の管理者用ページです。`,
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}
