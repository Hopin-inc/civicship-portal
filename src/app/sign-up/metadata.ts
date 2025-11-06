import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/communities/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.signup.metadata");

  const title = t("title", { communityTitle: currentCommunityConfig.title });
  const description = t("description", { communityTitle: currentCommunityConfig.title });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${currentCommunityConfig.domain}/sign-up`,
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
      canonical: `${currentCommunityConfig.domain}/sign-up`,
    },
  };
}
