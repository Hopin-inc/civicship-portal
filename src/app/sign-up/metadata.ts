import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { getTranslations } from "next-intl/server";
import { getCommunityConfig } from "@/lib/communities/getCommunityConfig";
import { headers, cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.signup.metadata");
  
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  // Fetch community config from database
  const communityConfig = await getCommunityConfig(communityId);

  const title = t("title", { communityTitle: communityConfig?.title || "" });
  const description = t("description", { communityTitle: communityConfig?.title || "" });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${communityConfig?.domain || ""}/sign-up`,
      type: "website",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    alternates: {
      canonical: `${communityConfig?.domain || ""}/sign-up`,
    },
  };
}
