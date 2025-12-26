import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { getTranslations } from "next-intl/server";
import { getCommunityConfig } from "@/lib/graphql/getCommunityConfig";
import { headers, cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  // Fetch community config from database
  const communityConfig = await getCommunityConfig(communityId);
  
  return {
    title: t("users.me.meta.title", { communityName: communityConfig?.title || "" }),
    description: t("users.me.meta.description"),
    openGraph: {
      type: "website",
      title: t("users.me.meta.ogTitle", { communityName: communityConfig?.title || "" }),
      description: t("users.me.meta.ogDescription"),
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}
