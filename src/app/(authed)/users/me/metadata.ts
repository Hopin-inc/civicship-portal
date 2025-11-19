import { Metadata } from "next";
import { currentCommunityConfig, DEFAULT_OPEN_GRAPH_IMAGE } from "@/lib/communities/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  
  return {
    title: t("users.me.meta.title", { communityName: currentCommunityConfig.title }),
    description: t("users.me.meta.description"),
    openGraph: {
      type: "website",
      title: t("users.me.meta.ogTitle", { communityName: currentCommunityConfig.title }),
      description: t("users.me.meta.ogDescription"),
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
  };
}
