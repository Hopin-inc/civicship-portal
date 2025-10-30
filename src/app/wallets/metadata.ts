import { Metadata } from "next";
import { DEFAULT_OPEN_GRAPH_IMAGE, currentCommunityConfig } from "@/lib/communities/metadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  
  return {
    title: t("wallets.meta.title", { communityName: currentCommunityConfig.title }),
    description: t("wallets.meta.description"),
    openGraph: {
      title: t("wallets.meta.title", { communityName: currentCommunityConfig.title }),
      description: t("wallets.meta.description"),
      url: `${currentCommunityConfig.domain}/wallets`,
      type: "website",
      locale: "ja_JP",
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    twitter: {
      card: "summary_large_image",
      title: t("wallets.meta.title", { communityName: currentCommunityConfig.title }),
      description: t("wallets.meta.description"),
      images: DEFAULT_OPEN_GRAPH_IMAGE,
    },
    alternates: {
      canonical: `${currentCommunityConfig.domain}/wallets`,
    },
  };
}
