import { Metadata } from "next";
import { getCommunityConfig, getDefaultOgImage } from "@/lib/communities/config";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const communityId = await getCommunityIdFromHeader();
  const [t, config] = await Promise.all([
    getTranslations("auth.signup.metadata"),
    communityId ? getCommunityConfig(communityId) : Promise.resolve(null),
  ]);

  const communityTitle = config?.title || "";
  const domain = config?.domain || "";
  const ogImages = getDefaultOgImage(config);

  const title = t("title", { communityTitle });
  const description = t("description", { communityTitle });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${domain}/sign-up`,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
    alternates: {
      canonical: `${domain}/sign-up`,
    },
  };
}
