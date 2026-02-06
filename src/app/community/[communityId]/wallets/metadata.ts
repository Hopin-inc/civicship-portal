import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const communityId = await getCommunityIdFromHeader();
  const [t, config] = await Promise.all([
    getTranslations(),
    communityId ? getCommunityConfig(communityId) : Promise.resolve(null),
  ]);

  const communityName = config?.title || "";
  const domain = config?.domain || "";
  const ogImages = getDefaultOgImage(config);

  return {
    title: t("wallets.meta.title", { communityName }),
    description: t("wallets.meta.description"),
    openGraph: {
      title: t("wallets.meta.title", { communityName }),
      description: t("wallets.meta.description"),
      url: `${domain}/wallets`,
      type: "website",
      locale: "ja_JP",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: t("wallets.meta.title", { communityName }),
      description: t("wallets.meta.description"),
      images: ogImages,
    },
    alternates: {
      canonical: `${domain}/wallets`,
    },
  };
}
