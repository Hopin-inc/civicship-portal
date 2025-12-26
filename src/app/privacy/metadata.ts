import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { Metadata } from "next";
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
    title: `${title} - プライバシーポリシー`,
    description: "個人情報の取り扱いについてご確認いただけます。",
    openGraph: {
      title: `${title} - プライバシーポリシー`,
      description: "個人情報の取り扱い方針についてご確認いただけます。",
      url: `${communityConfig?.domain || ""}/privacy`,
      type: "website",
      locale: "ja_JP",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - プライバシーポリシー`,
      description: "個人情報の取り扱い方針についてご確認いただけます。",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    alternates: {
      canonical: `${communityConfig?.domain || ""}/privacy`,
    },
  };
}
