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
    title: `${title} - 利用規約`,
    description: `${title}をご利用いただく際の規約をご案内します。`,
    openGraph: {
      title: `${title} - 利用規約`,
      description: `${title}をご利用いただく際の規約をご案内します。`,
      url: `${communityConfig?.domain || ""}/terms`,
      type: "website",
      locale: "ja_JP",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - 利用規約`,
      description: `${title}をご利用いただく際の規約をご案内します。`,
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    alternates: {
      canonical: `${communityConfig?.domain || ""}/terms`,
    },
  };
}
