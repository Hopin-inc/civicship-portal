import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ communityId: string }>;
}): Promise<Metadata> {
  const { communityId } = await params;
  const [t, config] = await Promise.all([
    getTranslations(),
    getCommunityConfig(communityId),
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
