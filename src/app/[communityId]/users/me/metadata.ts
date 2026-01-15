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
