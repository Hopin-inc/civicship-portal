import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { getTranslations } from "next-intl/server";
import { getCommunityConfig } from "@/lib/communities/getCommunityConfig";
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
    title: t("wallets.meta.title", { communityName: communityConfig?.title || "" }),
    description: t("wallets.meta.description"),
    openGraph: {
      title: t("wallets.meta.title", { communityName: communityConfig?.title || "" }),
      description: t("wallets.meta.description"),
      url: `${communityConfig?.domain || ""}/wallets`,
      type: "website",
      locale: "ja_JP",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    twitter: {
      card: "summary_large_image",
      title: t("wallets.meta.title", { communityName: communityConfig?.title || "" }),
      description: t("wallets.meta.description"),
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    alternates: {
      canonical: `${communityConfig?.domain || ""}/wallets`,
    },
  };
}
