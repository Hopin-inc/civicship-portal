import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { getCommunityConfig } from "@/lib/graphql/getCommunityConfig";
import { headers, cookies } from "next/headers";

const fallbackDescription = "体験が始まるその一歩は、ここから。文化と自然、人のあたたかさにふれる募集がそろいました。気になる体験を見つけて、あなただけの時間を過ごしてみませんか。";
const fallbackShortDescription = "文化と自然、人のあたたかさにふれる募集がそろいました。気になる体験を探してみませんか。";

export async function generateMetadata(): Promise<Metadata> {
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  // Fetch community config from database
  const communityConfig = await getCommunityConfig(communityId);
  const title = communityConfig?.title || "";
  const description = communityConfig?.description || fallbackDescription;
  const shortDescription = communityConfig?.shortDescription || fallbackShortDescription;
  
  return {
    title: `${title} - 募集一覧`,
    description: description,
    openGraph: {
      title: `${title} - 募集一覧`,
      description: description,
      url: `${communityConfig?.domain || ""}/activities`,
      type: "website",
      locale: "ja_JP",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - 募集一覧`,
      description: shortDescription,
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    alternates: {
      canonical: `${communityConfig?.domain || ""}/activities`,
    },
  };
}
