import { Metadata } from "next";
import { getCommunityConfigFromEnv, getDefaultOgImage } from "@/lib/communities/config";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const [t, config] = await Promise.all([
    getTranslations(),
    getCommunityConfigFromEnv(),
  ]);
  
  const communityName = config?.title || "";
  const ogImages = getDefaultOgImage(config);
  
  return {
    title: t("users.me.meta.title", { communityName }),
    description: t("users.me.meta.description"),
    openGraph: {
      type: "website",
      title: t("users.me.meta.ogTitle", { communityName }),
      description: t("users.me.meta.ogDescription"),
      images: ogImages,
    },
  };
}
