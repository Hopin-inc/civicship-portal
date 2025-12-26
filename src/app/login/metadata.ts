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
    title: `${title} - ログイン`,
    description: `ログインして、あなただけの${title}を。`,
    openGraph: {
      title: `${title} - ログイン`,
      description: `ログインして、あなただけの${title}を。`,
      url: `${communityConfig?.domain || ""}/login`,
      type: "website",
      locale: "ja_JP",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ログイン`,
      description: `ログインして、あなただけの${title}を。`,
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    alternates: {
      canonical: `${communityConfig?.domain || ""}/login`,
    },
  };
}
