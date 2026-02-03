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
